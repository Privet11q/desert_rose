import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { BRAND, PAYMENTS } from "@/constants/site";
import SocialLinks from "@/components/SocialLinks";

const EXPLORE = [
  { to: "/about", label: "About Susana", id: "about" },
  { to: "/book", label: "Book a Performance", id: "book" },
  { to: "/shop", label: "Shop Costumes", id: "shop" },
  { to: "/custom-orders", label: "Custom Orders", id: "custom-orders" },
  { to: "/contact", label: "Contact", id: "contact" },
];

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="grain relative bg-flame-velvetDeep text-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:px-8 md:grid-cols-3">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Flame className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl">
              Silk Road <em className="text-gold-gradient">Flame</em>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-cream/60">
            Belly dance, hula, and handcrafted couture costumes by Susana — performances and pieces that set every event aglow.
          </p>
          <SocialLinks variant="dark" />
        </div>

        <div>
          <h3 className="eyebrow mb-6">Explore</h3>
          <ul className="space-y-3">
            {EXPLORE.map((l) => (
              <li key={l.id}>
                <Link
                  to={l.to}
                  data-testid={`footer-link-${l.id}`}
                  className="text-sm text-cream/70 transition-colors duration-300 hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="eyebrow">Bookings & Orders</h3>
          <p className="text-sm leading-relaxed text-cream/60">
            Ready to bring the flame to your event, or dreaming of a one-of-a-kind costume? Susana personally replies to every inquiry.
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p.id}
                data-testid={`footer-payment-${p.id}`}
                className="rounded-full border border-gold/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-light/80"
              >
                {p.label}
              </span>
            ))}
          </div>
          <Link to="/book" data-testid="footer-cta-book" className="btn-gold !px-6 !py-3 !text-xs">
            Start a Booking
          </Link>
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-cream/40 sm:flex-row sm:px-8">
          <p>&copy; {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
          <p>Handcrafted with love, bead by bead.</p>
        </div>
      </div>
    </footer>
  );
}
