import Seo from "@/components/Seo";
import { Reveal, MaskedLine, FadeIn } from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import PaymentBadges from "@/components/PaymentBadges";
import { SocialCards } from "@/components/SocialLinks";

const CONTACT_FIELDS = [
  { name: "name", label: "Name", kind: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", kind: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone", kind: "tel", placeholder: "(555) 123-4567" },
  { name: "subject", label: "Subject", kind: "text", placeholder: "Booking, costume order, question..." },
  { name: "message", label: "Message", kind: "textarea", required: true, placeholder: "How can Susana help?" },
];

export default function Contact() {
  return (
    <div data-testid="contact-page">
      <Seo
        title="Contact | Silk Road Flame"
        siteName="Silk Road Flame"
        description="Get in touch with Susana of Silk Road Flame — bookings, costume orders, and questions. Payments via PayPal, Venmo, and Zelle."
      />

      <section className="grain relative overflow-hidden bg-flame-velvetDeep pt-32 pb-20 lg:pt-40">
        <div className="pointer-events-none absolute -right-32 top-10 h-[380px] w-[380px] rounded-full bg-flame-crimson/30 blur-[140px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <FadeIn>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-10 bg-gold" /> Say Hello
            </p>
          </FadeIn>
          <h1 className="font-serif leading-[1.02] tracking-tight text-cream">
            <MaskedLine delay={0.15} className="text-4xl sm:text-5xl lg:text-6xl">
              Let&apos;s <span className="text-gold-gradient italic">talk</span>
            </MaskedLine>
          </h1>
          <FadeIn delay={0.6}>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-cream/70 sm:text-lg">
              Questions about a booking, a costume, sizing, or a custom idea — every message lands
              directly with Susana.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-2xl text-flame-crimson">Payment methods</h2>
                <p className="mt-3 text-sm leading-relaxed text-flame-muted">
                  Once your booking or order is confirmed, Susana accepts payment through any of
                  these — whichever is easiest for you.
                </p>
                <div className="mt-5">
                  <PaymentBadges />
                </div>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-flame-crimson">Follow along</h2>
                <p className="mt-3 text-sm leading-relaxed text-flame-muted">
                  New costumes, performance clips, and behind-the-seams moments.
                </p>
                <div className="mt-5">
                  <SocialCards />
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="rounded-3xl border border-gold/25 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(106,13,37,0.3)] sm:p-10">
              <h2 className="mb-8 font-serif text-2xl text-flame-crimson">Send a message</h2>
              <InquiryForm
                type="contact"
                formId="contact"
                fields={CONTACT_FIELDS}
                submitLabel="Send Message"
                successTitle="Message sent!"
                successMessage="Thank you for reaching out — Susana will get back to you soon."
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
