import Seo from "@/components/Seo";
import { IMAGES } from "@/constants/site";
import { Reveal, MaskedLine, FadeIn } from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import PaymentBadges from "@/components/PaymentBadges";

const STEPS = [
  { num: "01", title: "Consultation", copy: "Share your vision — the event, the music, the colors, the silhouette. Susana sketches ideas and sources fabrics with you." },
  { num: "02", title: "Design & Fitting", copy: "Measurements, mock-ups, and fittings until the piece moves exactly the way you do." },
  { num: "03", title: "Hand Beadwork", copy: "The slow magic: crystals, coins, fringe, and embroidery sewn entirely by hand." },
  { num: "04", title: "The Reveal", copy: "Final fitting, finishing touches, and delivery — ready for its spotlight moment." },
];

const CUSTOM_FIELDS = [
  { name: "name", label: "Name", kind: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", kind: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone", kind: "tel", placeholder: "(555) 123-4567" },
  { name: "costume_type", label: "Type of Costume", kind: "select", placeholder: "Choose one...", options: ["Belly Dance Costume", "Mermaid Costume", "Event / Themed Costume", "Something Else"] },
  { name: "event_date", label: "Event Date", kind: "date" },
  { name: "budget", label: "Budget", kind: "select", placeholder: "Choose a range...", options: ["Under $200", "$200 - $400", "$400 - $700", "$700+"] },
  { name: "message", label: "Describe Your Vision", kind: "textarea", placeholder: "Colors, fabrics, inspiration, the story of the event — anything that helps Susana dream with you..." },
];

export default function CustomOrders() {
  return (
    <div data-testid="custom-orders-page">
      <Seo
        title="Custom Costume Orders | Silk Road Flame"
        siteName="Silk Road Flame"
        description="Commission a one-of-a-kind custom costume — belly dance, mermaid, or event wear — handcrafted by Susana."
      />

      <section className="grain relative overflow-hidden bg-flame-velvetDeep pt-32 pb-20 lg:pt-40">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[380px] w-[380px] rounded-full bg-flame-crimson/30 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-4 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeIn>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-10 bg-gold" /> Bespoke Couture
              </p>
            </FadeIn>
            <h1 className="font-serif leading-[1.02] tracking-tight text-cream">
              <MaskedLine delay={0.15} className="text-4xl sm:text-5xl lg:text-6xl">
                Custom orders,
              </MaskedLine>
              <MaskedLine delay={0.35} className="text-4xl italic sm:text-5xl lg:text-6xl">
                <span className="text-gold-gradient">made for your moment</span>
              </MaskedLine>
            </h1>
            <FadeIn delay={0.7}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
                A stage debut, a wedding, a festival, a photoshoot — if you can dream it, Susana can
                stitch it. Custom costumes for any event, built around your body and your story.
              </p>
            </FadeIn>
          </div>
          <div className="lg:col-span-5">
            <FadeIn delay={0.4}>
              <div className="clip-arch mx-auto max-w-sm overflow-hidden border border-gold/40 shadow-2xl lg:max-w-none">
                <img
                  src={IMAGES.embroidery}
                  alt="Handcrafted gold beadwork and embroidery detail on a costume"
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-8">
        <Reveal>
          <p className="eyebrow mb-4">The Process</p>
          <h2 className="max-w-xl font-serif text-3xl tracking-tight text-flame-crimson sm:text-4xl">
            From first sketch to final fitting
          </h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.1} className={i % 2 === 1 ? "lg:mt-12" : ""}>
              <div data-testid={`process-step-${s.num}`} className="group border-t-2 border-gold/40 pt-6 transition-colors duration-500 hover:border-gold">
                <p className="font-serif text-5xl italic text-gold/60 transition-colors duration-500 group-hover:text-gold">
                  {s.num}
                </p>
                <h3 className="mt-4 font-serif text-xl text-flame-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-flame-muted">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grain relative bg-flame-velvet py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-4">Start Your Commission</p>
            <h2 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl">
              Tell her what you are dreaming of
            </h2>
            <p className="mt-5 text-base leading-relaxed text-cream/70">
              The more detail, the better — Susana will reply with ideas, a timeline, and a quote.
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
                type="custom"
                formId="custom-order"
                fields={CUSTOM_FIELDS}
                submitLabel="Send Custom Order Request"
                successTitle="Request received!"
                successMessage="Thank you! Susana will reply soon with ideas, a timeline, and a quote for your custom piece."
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
