import { Camera, HeartHandshake, Scissors, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import { IMAGES } from "@/constants/site";
import { Reveal, MaskedLine, FadeIn } from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import { SocialCards } from "@/components/SocialLinks";

const PILLARS = [
  { icon: Scissors, title: "Handcrafted", copy: "Every costume is cut, beaded, and finished by Susana's own hands — no two pieces are ever alike." },
  { icon: Sparkles, title: "Stage-Ready", copy: "Built to move. Each design is tested under lights and in motion before it ever leaves the studio." },
  { icon: HeartHandshake, title: "Made With You", copy: "Custom pieces begin with your story — your event, your music, your colors, your silhouette." },
];

function PhotoPlaceholder({ label, tall = false }) {
  return (
    <div
      data-testid={`about-photo-placeholder-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gold/40 bg-flame-velvet/5 p-8 text-center ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
    >
      <Camera className="h-8 w-8 text-gold/60" />
      <p className="mt-3 font-serif text-xl italic text-flame-muted">{label}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-flame-muted/60">
        Photo placeholder — replace anytime
      </p>
    </div>
  );
}

export default function About() {
  return (
    <div data-testid="about-page">
      <Seo
        title="About Susana | Silk Road Flame"
        siteName="Silk Road Flame"
        description="The story of Susana — belly dancer, hula dancer, and costume artisan behind Silk Road Flame."
      />

      <section className="grain relative overflow-hidden bg-flame-velvetDeep pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-flame-crimson/30 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeIn>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-gold" /> About the Artist
              </p>
            </FadeIn>
            <h1 className="font-serif leading-[1.02] tracking-tight text-cream">
              <MaskedLine delay={0.15} className="text-4xl sm:text-5xl lg:text-6xl">
                The woman behind
              </MaskedLine>
              <MaskedLine delay={0.35} className="text-4xl italic sm:text-5xl lg:text-6xl">
                <span className="text-gold-gradient">the flame</span>
              </MaskedLine>
            </h1>
            <FadeIn delay={0.7}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
                Susana fell in love with belly dance the way you fall into music — completely. What
                began as a single class became a life of hip drops, veils, and stage lights, and
                eventually a second art: sewing the very costumes she dances in.
              </p>
            </FadeIn>
          </div>
          <div className="lg:col-span-5">
            <FadeIn delay={0.4}>
              <div className="clip-arch mx-auto max-w-sm overflow-hidden border border-gold/40 shadow-2xl lg:max-w-none">
                <img
                  src={IMAGES.portrait}
                  alt="Portrait of dancer Susana in streaming light"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Marquee items={["Belly Dance", "Hula", "Costume Atelier", "Silk Road Flame", "Est. with Love"]} />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">The Story</p>
            <h2 className="font-serif text-3xl tracking-tight text-flame-crimson sm:text-4xl">
              From a single class to a silk-road of her own
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-flame-ink/80">
              <p>
                Silk Road Flame was born where two passions met: the ancient, undulating art of
                belly dance, and the quiet, meditative craft of the sewing table. Susana performs
                belly dance as her first love — and brings the same warmth to hula and other dance
                styles when an event calls for it.
              </p>
              <p>
                Between performances, she is at her machine or hunched over a bead mat, handcrafting
                belly dance costumes, swimmable mermaid tails, and one-of-a-kind event wear. Every
                fringe is knotted, every crystal set, by hand.
              </p>
              <p>
                The name says it all: silk for the fabrics and the journey, flame for what happens
                when the music starts.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            <Reveal delay={0.1}>
              <PhotoPlaceholder label="Susana performing live" tall />
            </Reveal>
            <div className="space-y-6 sm:mt-10">
              <Reveal delay={0.2}>
                <div className="overflow-hidden rounded-3xl border border-gold/30">
                  <img
                    src={IMAGES.embroidery}
                    alt="Close-up of hand-sewn gold beadwork on a costume"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <PhotoPlaceholder label="At the sewing table" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="grain relative bg-flame-velvet py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <p className="eyebrow mb-4">The Philosophy</p>
            <h2 className="max-w-xl font-serif text-3xl tracking-tight text-cream sm:text-4xl">
              Slow-made in a fast world
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.12}>
                <div
                  data-testid={`pillar-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="rounded-3xl border border-gold/20 bg-white/5 p-8 backdrop-blur transition-colors duration-500 hover:border-gold/50"
                >
                  <p.icon className="h-8 w-8 text-gold" />
                  <h3 className="mt-5 font-serif text-2xl text-cream">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">{p.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <Reveal>
          <p className="eyebrow mb-4">Stay Connected</p>
          <h2 className="mb-10 font-serif text-3xl tracking-tight text-flame-crimson sm:text-4xl">
            Follow the journey
          </h2>
        </Reveal>
        <SocialCards />
      </section>
    </div>
  );
}
