import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InquiryForm from "@/components/InquiryForm";
import PaymentBadges from "@/components/PaymentBadges";

const FIELDS = [
  { name: "name", label: "Name", kind: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", kind: "email", required: true, placeholder: "you@example.com" },
  { name: "phone", label: "Phone", kind: "tel", placeholder: "(555) 123-4567" },
  { name: "message", label: "Message", kind: "textarea", placeholder: "Questions about sizing, shipping, timing..." },
];

export default function CostumeInquireDialog({ costume, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="costume-inquire-dialog"
        className="max-h-[90vh] max-w-xl overflow-y-auto border-gold/40 bg-cream"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-flame-crimson sm:text-3xl">
            {costume ? `Inquire — ${costume.name}` : "Inquire"}
          </DialogTitle>
          <DialogDescription className="text-flame-muted">
            Send Susana a message about this piece. She will reply personally with availability and
            payment details.
          </DialogDescription>
        </DialogHeader>
        {costume && (
          <InquiryForm
            key={costume.id}
            type="costume"
            formId="costume-inquiry"
            fields={FIELDS}
            prefill={{
              message: `Hi Susana! I'm interested in the "${costume.name}" ($${Number(costume.price).toFixed(0)}). Is it still available?`,
            }}
            submitLabel="Send Inquiry"
            successTitle="Inquiry sent!"
            successMessage="Thank you! Susana will reply soon with availability and payment details (PayPal, Venmo, or Zelle)."
          />
        )}
        <div className="mt-2 border-t border-flame-ink/10 pt-4">
          <PaymentBadges showNote={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
