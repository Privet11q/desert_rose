import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import { api } from "@/lib/api";
import { Reveal, MaskedLine, FadeIn } from "@/components/Reveal";
import CostumeCard from "@/components/CostumeCard";
import CostumeInquireDialog from "@/components/CostumeInquireDialog";
import PaymentBadges from "@/components/PaymentBadges";

const FILTERS = [
  { id: "all", label: "All Costumes" },
  { id: "belly-dance", label: "Belly Dance" },
  { id: "mermaid", label: "Mermaid" },
];

export default function Shop() {
  const [filter, setFilter] = useState("all");
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquireCostume, setInquireCostume] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/costumes", { params: { category: filter } })
      .then((res) => setCostumes(res.data))
      .catch(() => setCostumes([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div data-testid="shop-page">
      <Seo
        title="Shop Costumes | Silk Road Flame"
        siteName="Silk Road Flame"
        description="Shop handcrafted belly dance and mermaid costumes by Susana — ready-to-wear pieces and custom orders."
      />

      <section className="grain relative overflow-hidden bg-flame-velvetDeep pt-32 pb-20 lg:pt-40">
        <div className="pointer-events-none absolute -right-32 top-0 h-[380px] w-[380px] rounded-full bg-gold/15 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <FadeIn>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-gold" /> The Collection
            </p>
          </FadeIn>
          <h1 className="font-serif leading-[1.02] tracking-tight text-cream">
            <MaskedLine delay={0.15} className="text-4xl sm:text-5xl lg:text-6xl">
              Shop <span className="text-gold-gradient italic">costumes</span>
            </MaskedLine>
          </h1>
          <FadeIn delay={0.6}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
              Ready-to-wear belly dance and mermaid costumes, each handcrafted and one of a kind.
              See something you love? Inquire and Susana will confirm availability and payment
              details personally.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3" role="tablist" aria-label="Costume categories">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                data-testid={`shop-filter-${f.id}`}
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  filter === f.id
                    ? "border-flame-crimson bg-flame-crimson text-cream"
                    : "border-flame-ink/20 bg-white text-flame-muted hover:border-flame-crimson/50 hover:text-flame-crimson"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {loading ? (
          <div data-testid="shop-loading" className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : costumes.length === 0 ? (
          <p data-testid="shop-empty" className="py-24 text-center font-serif text-2xl italic text-flame-muted">
            New pieces are being stitched — check back soon.
          </p>
        ) : (
          <div data-testid="shop-grid" className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {costumes.map((c, i) => (
              <CostumeCard key={c.id} costume={c} index={i} onInquire={setInquireCostume} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] bg-flame-crimson px-6 py-14 sm:px-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/25 blur-[100px]" />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl">
                  Dreaming of something made just for you?
                </h2>
                <p className="mt-3 max-w-xl text-cream/75">
                  Custom orders are always welcome — belly dance, mermaid, or a costume for any
                  event you can imagine.
                </p>
                <div className="mt-6">
                  <PaymentBadges dark showNote={false} />
                </div>
              </div>
              <Link to="/custom-orders" data-testid="shop-custom-order-cta" className="btn-gold">
                Start a Custom Order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <CostumeInquireDialog
        costume={inquireCostume}
        open={!!inquireCostume}
        onOpenChange={(v) => !v && setInquireCostume(null)}
      />
    </div>
  );
}
