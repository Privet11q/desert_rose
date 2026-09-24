import { Camera, Sparkles } from "lucide-react";
import { CATEGORY_LABELS } from "@/constants/site";
import { Reveal } from "@/components/Reveal";

function PlaceholderVisual({ name }) {
  return (
    <div
      data-testid="costume-photo-placeholder"
      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-flame-velvet via-flame-crimson/80 to-flame-velvetDeep p-6 text-center"
    >
      <Camera className="h-8 w-8 text-gold/70" />
      <p className="mt-4 font-serif text-5xl italic text-gold-light/90">{name?.[0] || "S"}</p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-cream/60">
        Photo coming soon
      </p>
    </div>
  );
}

export default function CostumeCard({ costume, onInquire, index = 0 }) {
  return (
    <Reveal delay={(index % 3) * 0.1} className="h-full">
      <article
        data-testid={`costume-card-${costume.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-[0_10px_40px_-20px_rgba(106,13,37,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_30px_60px_-25px_rgba(106,13,37,0.4)]"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {costume.image_url ? (
            <img
              src={costume.image_url}
              alt={costume.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <PlaceholderVisual name={costume.name} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flame-velvetDeep/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span
            data-testid={`costume-price-${costume.id}`}
            className="absolute right-4 top-4 rounded-full bg-flame-velvetDeep/85 px-4 py-1.5 font-serif text-lg text-gold-light backdrop-blur"
          >
            ${Number(costume.price).toFixed(0)}
          </span>
          {costume.featured && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-flame-velvetDeep">
              <Sparkles className="h-3 w-3" /> Featured
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flame-crimson/70">
            {CATEGORY_LABELS[costume.category] || costume.category}
          </p>
          <h3 className="font-serif text-2xl text-flame-ink">{costume.name}</h3>
          <p className="flex-1 text-sm leading-relaxed text-flame-muted">{costume.description}</p>
          <button
            type="button"
            data-testid={`costume-inquire-button-${costume.id}`}
            onClick={() => onInquire(costume)}
            className="btn-crimson mt-2 w-full !py-3 !text-xs"
          >
            Inquire / Buy Now
          </button>
        </div>
      </article>
    </Reveal>
  );
}
