export default function Marquee({ items }) {
  const content = items.map((t, i) => (
    <span
      key={i}
      className="mx-6 inline-flex items-center gap-6 font-serif text-2xl italic text-gold-light/90 sm:text-3xl"
    >
      {t}
      <span className="text-lg not-italic text-gold">&#10022;</span>
    </span>
  ));
  return (
    <div
      data-testid="editorial-marquee"
      className="relative overflow-hidden border-y border-gold/20 bg-flame-velvetDeep py-6"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <div className="flex items-center">{content}</div>
        <div className="flex items-center" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}
