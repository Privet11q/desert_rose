import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, apiError } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CORE_FIELDS = ["name", "email", "phone", "message"];

export default function InquiryForm({
  type,
  fields,
  submitLabel,
  successTitle,
  successMessage,
  prefill = {},
  formId,
}) {
  const initial = () => Object.fromEntries(fields.map((f) => [f.name, prefill[f.name] || ""]));
  const [values, setValues] = useState(initial);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (name, v) => setValues((s) => ({ ...s, [name]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const details = {};
    fields.forEach((f) => {
      if (!CORE_FIELDS.includes(f.name) && values[f.name]) details[f.name] = values[f.name];
    });
    try {
      await api.post("/inquiries", {
        type,
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        message: values.message || null,
        details,
      });
      setDone(true);
      toast.success(successMessage);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div
        data-testid={`${formId}-success`}
        className="rounded-3xl border border-gold/40 bg-white p-10 text-center shadow-[0_20px_60px_-20px_rgba(106,13,37,0.25)]"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" />
        <h3 className="mt-4 font-serif text-2xl text-flame-crimson sm:text-3xl">{successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-flame-muted">{successMessage}</p>
        <button
          type="button"
          data-testid={`${formId}-send-another-button`}
          onClick={() => {
            setDone(false);
            setValues(initial());
          }}
          className="btn-outline-crimson mt-8 !px-6 !py-3 !text-xs"
        >
          Send another message
        </button>
      </div>
    );
  }

  const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-flame-muted";
  const inputCls = "h-12 rounded-xl border-flame-ink/15 bg-white focus-visible:ring-gold";

  return (
    <form
      data-testid={`${formId}-form`}
      onSubmit={submit}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      {fields.map((f) => (
        <div key={f.name} className={f.kind === "textarea" || f.full ? "sm:col-span-2" : ""}>
          <label className={labelCls} htmlFor={`${formId}-${f.name}`}>
            {f.label}
            {f.required ? " *" : ""}
          </label>
          {f.kind === "select" ? (
            <Select value={values[f.name]} onValueChange={(v) => set(f.name, v)}>
              <SelectTrigger
                data-testid={`${formId}-${f.name}-input`}
                id={`${formId}-${f.name}`}
                className={inputCls}
              >
                <SelectValue placeholder={f.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={o} value={o} data-testid={`${formId}-${f.name}-option-${o.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : f.kind === "textarea" ? (
            <Textarea
              data-testid={`${formId}-${f.name}-input`}
              id={`${formId}-${f.name}`}
              rows={5}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => set(f.name, e.target.value)}
              className="rounded-xl border-flame-ink/15 bg-white focus-visible:ring-gold"
            />
          ) : (
            <Input
              data-testid={`${formId}-${f.name}-input`}
              id={`${formId}-${f.name}`}
              type={f.kind}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.name]}
              onChange={(e) => set(f.name, e.target.value)}
              className={inputCls}
            />
          )}
        </div>
      ))}
      <div className="sm:col-span-2">
        <button
          data-testid={`${formId}-submit-button`}
          type="submit"
          disabled={sending}
          className="btn-crimson w-full disabled:opacity-60 sm:w-auto"
        >
          {sending && <Loader2 className="h-4 w-4 animate-spin" />}
          {sending ? "Sending..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
