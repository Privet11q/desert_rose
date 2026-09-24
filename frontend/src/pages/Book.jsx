import Seo from "@/components/Seo";
import { IMAGES } from "@/constants/site";
import { Reveal, MaskedLine, FadeIn } from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import PaymentBadges from "@/components/PaymentBadges";

const STYLES = [
  {
    img: IMAGES.redGold,
    alt: "Elaborate red and gold belly dance performance costume",
    title: "Belly Dance",
    copy: "Her signature art. Classic raqs sharqi, drum solos, veil work, and finger cymbals — elegant, family-friendly, and utterly captivating.",
  },
  {
    img: IMAGES.hula,
    alt: "Hula dancer in traditional tropical attire",
    title: "Hula",
    copy: "The graceful storytelling of the islands. Perfect for luaus, summer festivals, poolside celebrations, and tropical-themed events.",
  },
  {
    img: IMAGES.portrait,
    alt: "Dancer portrait in streaming light",
    title: "Fusion & More",
    copy: "Something different in mind? Susana blends styles and learns new ones — tell her the mood of your event and she will match it.",
  },
];

const BOOK_FIELDS = [
  { name: "name", label: "Name", kind: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", kind: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone", kind: "tel", placeholder: "(555) 123-4567" },
  { name: "event_date", label: "Event Date", kind: "date" },
  { name: "event_type", label: "Event Type", kind: "select", placeholder: "Choose one...", options: ["Wedding", "Birthday / Private Party", "Corporate Event", "Festival / Cultural Event", "Restaurant / Venue Show", "Other"] },
  { name: "location", label: "Location", kind: "text", placeholder: "City, venue, or address" },
  { name: "message", label: "Message", kind: "textarea", placeholder: "Tell Susana about your event — the vibe, the audience, the music you love..." },
];

export default function Book() {
  return (
    <div data-testid="book-page">
      <Seo
        title="Book a Performance | Silk Road Flame"
        siteName="Silk Road Flame"
        description="Book Susana for belly dance, hula, and fusion dance performances — weddings, festivals, corporate events, and private celebrations."
      />

      <section className="grain relative overflow-hidden bg-flame-velvetDeep pt-32 pb-20 lg:pt-40">
        <div className="pointer-events-none absolute -left-32 top-10 h-[380px] w-[380px] rounded-full bg-flame-crimson/30 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <FadeIn>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-gold" /> Hire Me
            </p>
          </FadeIn>
          <h1 className="font-serif leading-[1.02] tracking-tight text-cream">
            <MaskedLine delay={0.15} className="text-4xl sm:text-5xl lg:text-6xl">
              Book a <span className="text-gold-gradient italic">performance</span>
            </MaskedLine>
          </h1>
          <FadeIn delay={0.6}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
              From intimate gatherings to grand stages, Susana brings warmth, elegance, and fire.
              Choose a style below — or dream up something new together.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STYLES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div
                data-testid={`dance-style-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="group overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-[0_10px_40px_-20px_rgba(106,13,37,0.25)]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <h2 className="font-serif text-2xl text-flame-crimson">{s.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-flame-muted">{s.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grain relative bg-flame-velvet py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">Event Booking</p>
            <h2 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl">
              Tell her about your event
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream/70">
              Share a few details and Susana will reply personally with availability, a tailored
              quote, and ideas for making your celebration unforgettable.
            </p>
            <div className="mt-8 rounded-2xl border border-gold/25 bg-white/5 p-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Payments accepted
              </p>
              <PaymentBadges dark />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="rounded-3xl bg-cream p-6 shadow-2xl sm:p-10">
              <InquiryForm
                type="booking"
                formId="booking"
                fields={BOOK_FIELDS}
                submitLabel="Request Booking"
                successTitle="Request received!"
                successMessage="Thank you! Susana will reply personally within a day or two with availability and a quote."
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
