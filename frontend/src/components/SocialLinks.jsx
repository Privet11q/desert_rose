import { Youtube, Instagram, ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/constants/site";
import { Reveal } from "@/components/Reveal";

export function TikTokIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const ICONS = {
  youtube: Youtube,
  tiktok: TikTokIcon,
  instagram: Instagram,
};

export default function SocialLinks({ variant = "dark" }) {
  const isDark = variant === "dark";
  return (
    <div className="flex items-center gap-4">
      {SOCIALS.map((s) => {
        const Icon = ICONS[s.id];
        return (
          <a
            key={s.id}
            data-testid={`social-link-${s.id}`}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} (placeholder link)`}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 ${
              isDark
                ? "border-gold/30 text-gold hover:border-gold hover:bg-gold hover:text-flame-velvetDeep"
                : "border-flame-crimson/30 text-flame-crimson hover:border-flame-crimson hover:bg-flame-crimson hover:text-cream"
            }`}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}

export function SocialCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {SOCIALS.map((s, i) => {
        const Icon = ICONS[s.id];
        return (
          <Reveal key={s.id} delay={i * 0.1}>
            <a
              data-testid={`social-card-${s.id}`}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-gold/25 bg-flame-velvet p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-flame-velvetDeep">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-serif text-xl text-cream">{s.label}</p>
                  <p className="text-sm text-cream/50">{s.handle}</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-gold/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}
