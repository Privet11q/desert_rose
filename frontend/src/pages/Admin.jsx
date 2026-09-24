import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Flame,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import Seo from "@/components/Seo";
import { api, apiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CATEGORY_LABELS } from "@/constants/site";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_BADGES = {
  booking: "bg-flame-crimson text-cream",
  custom: "bg-gold text-flame-velvetDeep",
  contact: "bg-blush text-flame-ink",
  costume: "bg-flame-velvet text-gold-light",
};

const EMPTY_COSTUME = {
  name: "",
  category: "belly-dance",
  description: "",
  price: "",
  image_url: "",
  featured: false,
  available: true,
};

function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-flame-velvetDeep px-4 pt-20">
      <form
        data-testid="admin-login-form"
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-gold/30 bg-white/95 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-flame-crimson text-gold-light">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-serif text-2xl text-flame-crimson">Studio Login</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-flame-muted">Silk Road Flame Admin</p>
          </div>
        </div>
        {error && (
          <p data-testid="admin-login-error" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-flame-muted" htmlFor="admin-email">
          Email
        </label>
        <Input
          data-testid="admin-email-input"
          id="admin-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 h-12 rounded-xl"
          placeholder="admin@silkroadflame.com"
        />
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-flame-muted" htmlFor="admin-password">
          Password
        </label>
        <Input
          data-testid="admin-password-input"
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 h-12 rounded-xl"
          placeholder="********"
        />
        <button data-testid="admin-login-submit-button" type="submit" disabled={busy} className="btn-crimson w-full disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function CostumeEditor({ costume, open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(EMPTY_COSTUME);
  const [busy, setBusy] = useState(false);
  const isEdit = !!costume?.id;

  useEffect(() => {
    if (open) setForm(costume?.id ? { ...costume, price: String(costume.price), image_url: costume.image_url || "" } : EMPTY_COSTUME);
  }, [open, costume]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      featured: !!form.featured,
      available: !!form.available,
    };
    try {
      if (isEdit) await api.put(`/admin/costumes/${costume.id}`, payload);
      else await api.post("/admin/costumes", payload);
      toast.success(isEdit ? "Costume updated" : "Costume added");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-flame-muted";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="costume-editor-dialog" className="max-h-[90vh] max-w-xl overflow-y-auto bg-cream">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-flame-crimson">
            {isEdit ? "Edit Costume" : "Add Costume"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="ce-name">Name *</label>
            <Input data-testid="costume-form-name-input" id="ce-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl bg-white" />
          </div>
          <div>
            <label className={labelCls} htmlFor="ce-category">Category</label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger data-testid="costume-form-category-input" id="ce-category" className="h-11 rounded-xl bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="belly-dance">Belly Dance</SelectItem>
                <SelectItem value="mermaid">Mermaid</SelectItem>
                <SelectItem value="other">Event &amp; Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className={labelCls} htmlFor="ce-price">Price (USD) *</label>
            <Input data-testid="costume-form-price-input" id="ce-price" type="number" min="0" step="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-11 rounded-xl bg-white" />
          </div>
          <div>
            <label className={labelCls} htmlFor="ce-image">Photo URL</label>
            <Input data-testid="costume-form-image-input" id="ce-image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://... (leave empty for placeholder)" className="h-11 rounded-xl bg-white" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="ce-description">Description</label>
            <Textarea data-testid="costume-form-description-input" id="ce-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl bg-white" />
          </div>
          <label className="flex items-center gap-3 text-sm text-flame-ink" htmlFor="ce-featured">
            <input data-testid="costume-form-featured-checkbox" id="ce-featured" type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[#6A0D25]" />
            Featured on home page
          </label>
          <label className="flex items-center gap-3 text-sm text-flame-ink" htmlFor="ce-available">
            <input data-testid="costume-form-available-checkbox" id="ce-available" type="checkbox" checked={!!form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="h-4 w-4 accent-[#6A0D25]" />
            Available in shop
          </label>
          <div className="sm:col-span-2">
            <button data-testid="costume-form-submit-button" type="submit" disabled={busy} className="btn-crimson w-full !py-3 !text-xs disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isEdit ? "Save Changes" : "Add Costume"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Dashboard() {
  const { logout } = useAuth();
  const [tab, setTab] = useState("inquiries");
  const [inquiries, setInquiries] = useState([]);
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState({ open: false, costume: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inq, cos] = await Promise.all([api.get("/admin/inquiries"), api.get("/admin/costumes")]);
      setInquiries(inq.data);
      setCostumes(cos.data);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const deleteInquiry = async (id) => {
    try {
      await api.delete(`/admin/inquiries/${id}`);
      setInquiries((s) => s.filter((i) => i.id !== id));
      toast.success("Inquiry removed");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const deleteCostume = async (id) => {
    try {
      await api.delete(`/admin/costumes/${id}`);
      setCostumes((s) => s.filter((c) => c.id !== id));
      toast.success("Costume removed");
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-cream pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-flame-crimson text-gold-light">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-serif text-3xl text-flame-crimson">Studio Dashboard</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-flame-muted">Silk Road Flame</p>
            </div>
          </div>
          <button data-testid="admin-logout-button" onClick={logout} className="btn-outline-crimson !px-5 !py-2.5 !text-xs">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>

        <div className="mt-10 flex gap-3 border-b border-flame-ink/10 pb-px">
          {[
            { id: "inquiries", label: `Inquiries (${inquiries.length})` },
            { id: "costumes", label: `Costumes (${costumes.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              data-testid={`admin-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`rounded-t-xl px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                tab === t.id ? "bg-flame-crimson text-cream" : "text-flame-muted hover:text-flame-crimson"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : tab === "inquiries" ? (
          <div data-testid="admin-inquiries-list" className="mt-8 space-y-4">
            {inquiries.length === 0 && (
              <p className="py-16 text-center font-serif text-xl italic text-flame-muted">No inquiries yet — they will appear here.</p>
            )}
            {inquiries.map((inq) => (
              <div key={inq.id} data-testid={`inquiry-card-${inq.id}`} className="rounded-2xl border border-gold/25 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${TYPE_BADGES[inq.type] || "bg-muted"}`}>
                      {inq.type}
                    </span>
                    <p className="font-serif text-lg text-flame-ink">{inq.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-flame-muted">
                      {inq.created_at ? new Date(inq.created_at).toLocaleString() : ""}
                    </p>
                    <button
                      type="button"
                      data-testid={`inquiry-delete-${inq.id}`}
                      onClick={() => deleteInquiry(inq.id)}
                      className="rounded-full p-2 text-flame-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete inquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-flame-muted">
                  <Mail className="h-3.5 w-3.5" /> {inq.email}
                  {inq.phone ? <span className="ml-3">{inq.phone}</span> : null}
                </p>
                {Object.keys(inq.details || {}).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(inq.details).map(([k, v]) => (
                      <span key={k} className="rounded-full bg-cream px-3 py-1 text-xs text-flame-ink">
                        <span className="font-semibold capitalize">{k.replace(/_/g, " ")}:</span> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
                {inq.message && <p className="mt-3 text-sm leading-relaxed text-flame-ink/80">{inq.message}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="admin-costumes-list" className="mt-8 space-y-4">
            <button
              type="button"
              data-testid="costume-add-button"
              onClick={() => setEditor({ open: true, costume: null })}
              className="btn-gold !px-6 !py-3 !text-xs"
            >
              <Plus className="h-4 w-4" /> Add Costume
            </button>
            {costumes.map((c) => (
              <div key={c.id} data-testid={`admin-costume-row-${c.id}`} className="flex flex-wrap items-center gap-5 rounded-2xl border border-gold/25 bg-white p-5 shadow-sm">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-flame-velvet">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-serif text-2xl italic text-gold-light/80">
                      {c.name?.[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-serif text-lg text-flame-ink">
                    {c.name}
                    {c.featured && <Star className="h-4 w-4 fill-gold text-gold" />}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-flame-muted">
                    {CATEGORY_LABELS[c.category] || c.category} &middot; ${Number(c.price).toFixed(0)} &middot;{" "}
                    {c.available ? "Available" : "Hidden"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid={`costume-edit-${c.id}`}
                    onClick={() => setEditor({ open: true, costume: c })}
                    className="rounded-full p-2.5 text-flame-crimson transition-colors hover:bg-flame-crimson/10"
                    aria-label="Edit costume"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    data-testid={`costume-delete-${c.id}`}
                    onClick={() => deleteCostume(c.id)}
                    className="rounded-full p-2.5 text-flame-muted transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete costume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CostumeEditor
        costume={editor.costume}
        open={editor.open}
        onOpenChange={(v) => setEditor((s) => ({ ...s, open: v }))}
        onSaved={load}
      />
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  return (
    <div data-testid="admin-page">
      <Seo title="Admin | Silk Road Flame" siteName="Silk Road Flame" />
      {user === null ? (
        <div className="flex min-h-screen items-center justify-center bg-flame-velvetDeep">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : user === false ? (
        <AdminLogin />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
