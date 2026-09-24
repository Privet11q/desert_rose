import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home", id: "home" },
  { to: "/about", label: "About", id: "about" },
  { to: "/book", label: "Book a Performance", id: "book" },
  { to: "/shop", label: "Shop Costumes", id: "shop" },
  { to: "/custom-orders", label: "Custom Orders", id: "custom-orders" },
  { to: "/contact", label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/15 bg-flame-velvetDeep/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Link
          to="/"
          data-testid="nav-brand-link"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-flame-velvetDeep">
            <Flame className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl leading-tight text-cream sm:text-2xl">
            Silk Road <em className="text-gold-gradient not-italic font-serif italic">Flame</em>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.id}
              to={l.to}
              data-testid={`nav-link-${l.id}`}
              className={({ isActive }) =>
                `text-[13px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                  isActive ? "text-gold" : "text-cream/70 hover:text-cream"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/book" data-testid="nav-book-now-button" className="btn-gold !px-6 !py-2.5 !text-xs">
            Book Now
          </Link>
        </nav>

        <button
          type="button"
          data-testid="nav-mobile-menu-button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            key={location.pathname}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-gold/10 bg-flame-velvetDeep/95 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    data-testid={`nav-mobile-link-${l.id}`}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 font-serif text-2xl ${isActive ? "text-gold" : "text-cream/80"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
