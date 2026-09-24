from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import ipaddress
import logging
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal, Annotated

import bcrypt
import jwt
import httpx
from bson import ObjectId
from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Mongo document base ----------

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        doc = self.model_dump(by_alias=True, exclude_none=True)
        if "_id" in doc and not isinstance(doc["_id"], ObjectId):
            doc["_id"] = ObjectId(doc["_id"])
        return doc

    @classmethod
    def from_mongo(cls, doc: dict):
        if doc is None:
            return None
        return cls(**doc)


class Costume(BaseDocument):
    name: str
    category: str = "belly-dance"
    description: str = ""
    price: float = 0
    image_url: Optional[str] = None
    featured: bool = False
    available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Inquiry(BaseDocument):
    type: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    details: dict = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Auth ----------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie(key="access_token", value=create_access_token(user_id, email), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=create_refresh_token(user_id), httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": str(user["_id"]), "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


class LoginInput(BaseModel):
    email: EmailStr
    password: str


@api_router.post("/auth/login")
async def login(payload: LoginInput, request: Request, response: Response):
    email = payload.email.lower()
    identifier = f"{request.client.host if request.client else 'unknown'}:{email}"
    now = datetime.now(timezone.utc)
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt:
        locked_until = attempt.get("locked_until")
        if attempt.get("count", 0) >= 5 and locked_until and locked_until > now:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        if locked_until and locked_until <= now:
            await db.login_attempts.delete_one({"identifier": identifier})
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"locked_until": now + timedelta(minutes=15)}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    set_auth_cookies(response, str(user["_id"]), email)
    return {"id": str(user["_id"]), "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "logged_out"}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    response.set_cookie(key="access_token", value=create_access_token(str(user["_id"]), user["email"]), httponly=True, secure=True, samesite="none", max_age=900, path="/")
    return {"status": "refreshed"}


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Susana",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
        logger.info("Seeded admin user")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Updated admin password")


# ---------- Email (Emergent managed Resend) ----------

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


def inquiry_email_html(inq: "Inquiry") -> str:
    rows = [
        ("Inquiry Type", inq.type.replace("-", " ").title()),
        ("Name", inq.name),
        ("Email", inq.email),
        ("Phone", inq.phone or "—"),
    ]
    labels = {"event_date": "Event Date", "event_type": "Event Type", "location": "Location",
              "costume_type": "Costume Type", "budget": "Budget", "costume_name": "Costume", "subject": "Subject"}
    for k, v in (inq.details or {}).items():
        if v:
            rows.append((labels.get(k, k.replace("_", " ").title()), str(v)))
    body_rows = "".join(
        f'<tr><td style="padding:8px 16px;color:#7A626A;font-size:12px;text-transform:uppercase;letter-spacing:1px">{escape(label)}</td>'
        f'<td style="padding:8px 16px;color:#2B181E;font-size:15px">{escape(str(value))}</td></tr>'
        for label, value in rows
    )
    message_block = ""
    if inq.message:
        message_block = (
            f'<tr><td colspan="2" style="padding:16px;color:#2B181E;font-size:15px;border-top:1px solid #E8B4B8">'
            f'{escape(inq.message).replace(chr(10), "<br/>")}</td></tr>'
        )
    return (
        '<table role="presentation" width="100%" style="background:#FAF6F0;padding:32px 0"><tr><td align="center">'
        '<table role="presentation" width="560" style="background:#ffffff;border:1px solid #E8B4B8;border-radius:12px;font-family:Georgia,serif">'
        f'<tr><td colspan="2" style="padding:24px 16px 8px;font-size:22px;color:#6A0D25">New inquiry — {escape(EMAIL_FROM_NAME)}</td></tr>'
        f"{body_rows}{message_block}</table>"
        f'<p style="font-size:12px;color:#7A626A;font-family:Arial,sans-serif">Sent by the {escape(EMAIL_FROM_NAME)} website. We never ask for passwords or card details by email.</p>'
        "</td></tr></table>"
    )


# ---------- Inquiries ----------

class InquiryCreate(BaseModel):
    type: Literal["booking", "custom", "contact", "costume"]
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    message: Optional[str] = Field(default=None, max_length=4000)
    details: dict = {}


@api_router.post("/inquiries", status_code=201)
async def create_inquiry(payload: InquiryCreate):
    inquiry = Inquiry(**payload.model_dump())
    result = await db.inquiries.insert_one(inquiry.to_mongo())
    inquiry.id = str(result.inserted_id)
    try:
        subject = f"New {inquiry.type.replace('-', ' ')} inquiry from {inquiry.name}"
        await send_email(to=OWNER_EMAIL, subject=subject, html=inquiry_email_html(inquiry), reply_to=str(inquiry.email))
    except Exception as e:
        logger.error(f"Inquiry saved but email notification failed: {e}")
    return inquiry.model_dump()


# ---------- Costumes (public) ----------

@api_router.get("/costumes")
async def list_costumes(category: Optional[str] = None):
    query = {"available": True}
    if category and category != "all":
        query["category"] = category
    docs = await db.costumes.find(query).sort("created_at", -1).to_list(200)
    return [Costume.from_mongo(d).model_dump() for d in docs]


@api_router.get("/costumes/featured")
async def featured_costumes():
    docs = await db.costumes.find({"available": True, "featured": True}).sort("created_at", -1).to_list(3)
    return [Costume.from_mongo(d).model_dump() for d in docs]


# ---------- Admin ----------

class CostumeInput(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    category: Literal["belly-dance", "mermaid", "other"] = "belly-dance"
    description: str = Field(default="", max_length=1000)
    price: float = Field(default=0, ge=0)
    image_url: Optional[str] = None
    featured: bool = False
    available: bool = True


@api_router.get("/admin/inquiries")
async def admin_list_inquiries(user: dict = Depends(require_admin)):
    docs = await db.inquiries.find({}).sort("created_at", -1).to_list(500)
    return [Inquiry.from_mongo(d).model_dump() for d in docs]


@api_router.delete("/admin/inquiries/{inquiry_id}")
async def admin_delete_inquiry(inquiry_id: str, user: dict = Depends(require_admin)):
    try:
        oid = ObjectId(inquiry_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    result = await db.inquiries.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"status": "deleted"}


@api_router.get("/admin/costumes")
async def admin_list_costumes(user: dict = Depends(require_admin)):
    docs = await db.costumes.find({}).sort("created_at", -1).to_list(500)
    return [Costume.from_mongo(d).model_dump() for d in docs]


@api_router.post("/admin/costumes", status_code=201)
async def admin_create_costume(payload: CostumeInput, user: dict = Depends(require_admin)):
    costume = Costume(**payload.model_dump())
    result = await db.costumes.insert_one(costume.to_mongo())
    costume.id = str(result.inserted_id)
    return costume.model_dump()


@api_router.put("/admin/costumes/{costume_id}")
async def admin_update_costume(costume_id: str, payload: CostumeInput, user: dict = Depends(require_admin)):
    try:
        oid = ObjectId(costume_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Costume not found")
    result = await db.costumes.update_one({"_id": oid}, {"$set": payload.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Costume not found")
    doc = await db.costumes.find_one({"_id": oid})
    return Costume.from_mongo(doc).model_dump()


@api_router.delete("/admin/costumes/{costume_id}")
async def admin_delete_costume(costume_id: str, user: dict = Depends(require_admin)):
    try:
        oid = ObjectId(costume_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Costume not found")
    result = await db.costumes.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Costume not found")
    return {"status": "deleted"}


# ---------- Seed & startup ----------

RED_SKIRT_IMG = "https://images.unsplash.com/photo-1542651061-6ba2416ef8c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMGJlbGx5JTIwZGFuY2UlMjBjb3N0dW1lJTIwZGV0YWlscyUyMGVtYnJvaWRlcnl8ZW58MHx8fHwxNzg5ODU1MzE3fDA&ixlib=rb-4.1.0&q=85"
EMBROIDERY_IMG = "https://images.unsplash.com/photo-1595092326145-144bbd600520?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxoYW5kY3JhZnRlZCUyMGJlbGx5JTIwZGFuY2UlMjBjb3N0dW1lJTIwZGV0YWlscyUyMGVtYnJvaWRlcnl8ZW58MHx8fHwxNzg5ODU1MzE3fDA&ixlib=rb-4.1.0&q=85"
RED_GOLD_IMG = "https://images.unsplash.com/photo-1770777351893-4a71409517a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHxiZWxseSUyMGRhbmNlciUyMHBlcmZvcm1hbmNlJTIwY29zdHVtZSUyMHJlZCUyMGdvbGR8ZW58MHx8fHwxNzg5ODU1MzE3fDA&ixlib=rb-4.1.0&q=85"

SEED_COSTUMES = [
    {"name": "Scarlet Mirage", "category": "belly-dance", "price": 340, "featured": True, "image_url": RED_SKIRT_IMG,
     "description": "Hand-beaded bra and belt set with a flowing double-slit skirt in deep crimson chiffon, finished with gold coin fringe."},
    {"name": "Gilded Ember", "category": "belly-dance", "price": 275, "featured": True, "image_url": EMBROIDERY_IMG,
     "description": "Black velvet bedlah embroidered with gold metallic thread, hand-sewn crystals and cascading beadwork."},
    {"name": "Sultana's Flame", "category": "belly-dance", "price": 390, "featured": True, "image_url": RED_GOLD_IMG,
     "description": "A show-stopping red and gold performance dress with layered skirts and dramatic hand-draped accents."},
    {"name": "Lagoon Siren", "category": "mermaid", "price": 520, "featured": False, "image_url": None,
     "description": "Swimmable mermaid tail with hand-painted scales in sea-glass greens and rose-gold highlights. Matching top included."},
    {"name": "Pearl Tide", "category": "mermaid", "price": 460, "featured": False, "image_url": None,
     "description": "Iridescent mermaid ensemble with shell crown, flowing tulle fins and pearl-drop detailing."},
]


async def seed_costumes():
    if await db.costumes.count_documents({}) == 0:
        await db.costumes.insert_many([Costume(**c).to_mongo() for c in SEED_COSTUMES])
        logger.info("Seeded costumes")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    await seed_costumes()


@api_router.get("/")
async def root():
    return {"message": "Silk Road Flame API"}


app.include_router(api_router)

origins = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip() and o.strip() != "*"]
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=origins or ["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
