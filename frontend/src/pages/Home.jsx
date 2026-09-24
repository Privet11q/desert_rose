import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Flame, Quote, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import { api } from "@/lib/api";
import { BRAND, IMAGES, SOCIALS } from "@/constants/site";
import { Reveal, MaskedLine, FadeIn, EASE } from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import CostumeCard from "@/components/CostumeCard";
import CostumeInquireDialog from "@/components/CostumeInquireDialog";
import { SocialCards } from "@/components/SocialLinks";
import PaymentBadges from "@/components/PaymentBadges";

const CHAPTERS = [
  {
    num: "01",
    title: "Belly Dance",
    copy: "Sinuous, magnetic, unforgettable. Susana's signature belly dance performances bring shimmering veils, finger cymbals, and pure stage fire to weddings, festivals, and private events.",
  },
  {
    num: "02",
    title: "Hula & Fusion",
    copy: "From the joyful storytelling of hula to fusion styles that borrow from every shore of the Silk Road — each set is tailored to the mood of your celebration.",
  },
  {
    num: "03",
    title: "Costume Atelier",
    copy: "Every bead sewn by hand. Susana crafts belly dance costumes, swimmable mermaid tails, and bespoke event wear — couture pieces made to move, shimmer, and fit like a dream.",
  },
];

const MARQUEE_ITEMS = ["Belly Dance", "Hula", "Fusion", "Custom Couture", "Mermaid Tails", "Event Performances", "Hand-Beaded", "One of a Kind"];

export default function Home() {
  const { scrollY } = useScroll();
  const yImg = useTransform(scrollY, [0, 700], [0, 90]);
  const [featured, setFeatured] = useState([]);
  const [inquireCostume, setInquireCostume] = useState(null);

  useEffect(() => {
    api.get("/costumes/featured").then((res) => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Seo
        title="Silk Road Flame | Belly Dance Performances & Handcrafted Costumes"
        siteName="Silk Road Flame"
        description="Susana of Silk Road Flame — belly dance and hula performances for unforgettable events, plus handcrafted belly dance, mermaid, and custom costumes."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND,
          description: "Belly dance performances and handcrafted costumes by Susana.",
          sameAs: SOCIALS.map((s) => s.href),
        }}
      />

      {/* HERO */}
      <section className="grain relative flex min-h-screen items-center overflow-hidden bg-flame-velvetDeep pt-28 pb-16">
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[480px] w-[480px] rounded-full bg-flame-crimson/30 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/15 blur-[140px]" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeIn delay={0.1}>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-gold" />
                Susana &middot; Belly Dancer &amp; Costume Artisan
              </p>
            </FadeIn>
            <h1 className="font-serif leading-[0.95] tracking-tight text-cream">
              <MaskedLine delay={0.25} className="text-4xl sm:text-6xl lg:text-7xl">
                Silk Road
              </MaskedLine>
              <MaskedLine delay={0.45} className="text-6xl italic sm:text-8xl lg:text-9xl">
                <span className="text-gold-gradient">Flame</span>
              </MaskedLine>
            </h1>
            <FadeIn delay={0.85}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
                Sinuous belly dance, joyful hula, and costumes stitched bead by bead — performances
                and couture pieces that set every event aglow.
              </p>
            </FadeIn>
            <FadeIn delay={1.0}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/book" data-testid="hero-book-performance-button" className="btn-gold">
                  Book a Performance <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/shop" data-testid="hero-shop-costumes-button" className="btn-outline-light">
                  Shop Costumes
                </Link>
              </div>
              <p className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cream/40">
                <Sparkles className="h-3.5 w-3.5 text-gold/60" />
                Handmade in the studio &middot; Custom orders welcome
              </p>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <motion.div style={{ y: yImg }} className="relative mx-auto max-w-sm lg:max-w-none">
              <motion.div
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
                className="clip-arch overflow-hidden border border-gold/40 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
              >
                <motion.img
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
                  src={IMAGES.hero}
                  alt="Susana performing belly dance in a pink and gold beaded costume"
                  className="aspect-[3/4] w-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
                className="animate-float-slow absolute -bottom-6 -left-4 rounded-2xl border border-gold/30 bg-white/90 p-4 shadow-xl backdrop-blur sm:-left-10"
              >
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-flame-crimson">
                  <Flame className="h-4 w-4 text-gold-deep" /> Hand-Beaded Couture
                </p>
                <p className="mt-1 text-xs text-flame-muted">Every costume a one-of-one original</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      {/* MANIFESTO CHAPTERS */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <p className="eyebrow mb-4">The Craft</p>
          <h2 className="max-w-2xl font-serif text-3xl tracking-tight text-flame-crimson sm:text-4xl lg:text-5xl">
            Two arts, one flame — the stage and the sewing table.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.num} delay={i * 0.12} className={i === 1 ? "md:mt-14" : ""}>
              <div data-testid={`chapter-${c.num}`} className="group border-t-2 border-gold/40 pt-6 transition-colors duration-500 hover:border-gold">
                <p className="font-serif text-5xl italic text-gold/60 transition-colors duration-500 group-hover:text-gold">
                  {c.num}
                </p>
                <h3 className="mt-4 font-serif text-2xl text-flame-ink">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-flame-muted">{c.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED COSTUMES */}
      <section className="grain relative bg-flame-velvet py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow mb-4">From the Atelier</p>
              <h2 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl lg:text-5xl">
                Featured costumes
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <Link to="/shop" data-testid="featured-view-all-link" className="btn-outline-light !px-6 !py-3 !text-xs">
                View all costumes <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div data-testid="featured-costumes-grid" className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c, i) => (
              <CostumeCard key={c.id} costume={c} index={i} onInquire={setInquireCostume} />
            ))}
            {featured.length === 0 && (
              <p className="col-span-full text-cream/50">Costumes are being added to the collection — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* BOOKING CTA BANNER */}
      <section className="grain relative overflow-hidden bg-flame-crimson py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/20 blur-[100px]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <h2 className="max-w-xl font-serif text-3xl tracking-tight text-cream sm:text-4xl">
              Bring the flame to your next event.
            </h2>
            <p className="mt-3 max-w-lg text-cream/75">
              Weddings, festivals, birthdays, restaurant shows — tell Susana about your celebration
              and she will craft a performance around it.
            </p>
            <div className="mt-6">
              <PaymentBadges dark showNote={false} />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Link to="/book" data-testid="cta-book-performance-button" className="btn-gold">
              Book a Performance <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS PLACEHOLDER */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8 lg:py-32">
        <Reveal>
          <p className="eyebrow mb-4">Kind Words</p>
          <h2 className="font-serif text-3xl tracking-tight text-flame-crimson sm:text-4xl">
            What clients say
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div
                data-testid={`testimonial-placeholder-${i + 1}`}
                className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blush/70 bg-white/50 p-10 text-center"
              >
                <Quote className="h-8 w-8 text-gold/50" />
                <p className="mt-4 font-serif text-lg italic text-flame-muted">
                  Testimonial coming soon
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-flame-muted/60">
                  Client love will live here
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SOCIAL */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-8 lg:pb-32">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] bg-flame-velvetDeep px-6 py-14 sm:px-12">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-flame-crimson/40 blur-[100px]" />
            <div className="relative">
              <p className="eyebrow mb-4">Follow the Flame</p>
              <h2 className="max-w-xl font-serif text-3xl tracking-tight text-cream sm:text-4xl">
                Performances, tutorials &amp; behind-the-seams
              </h2>
              <div className="mt-10">
                <SocialCards />
              </div>
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
