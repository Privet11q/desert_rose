import { Wallet } from "lucide-react";
import { PAYMENTS } from "@/constants/site";

export default function PaymentBadges({ dark = false, showNote = true }) {
  return (
    <div data-testid="payment-methods" className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {PAYMENTS.map((p) => (
          <button
            key={p.id}
            type="button"
            data-testid={`payment-pill-${p.id}`}
            title="Payment link coming soon"
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
              dark
                ? "border-gold/40 bg-gold/10 text-gold-light hover:bg-gold hover:text-flame-velvetDeep"
                : "border-flame-crimson/30 bg-white text-flame-crimson hover:bg-flame-crimson hover:text-cream"
            }`}
          >
            <Wallet className="h-4 w-4" />
            Pay via {p.label}
          </button>
        ))}
      </div>
      {showNote && (
        <p className={`text-sm ${dark ? "text-cream/60" : "text-flame-muted"}`}>
          Secure payment links for PayPal, Venmo, and Zelle are shared once your booking or order is confirmed.
        </p>
      )}
    </div>
  );
}
