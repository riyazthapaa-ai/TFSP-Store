const messages = [
  "DOPE PRODUCTS FOR DOPE PEOPLE",
  "TFSP",
  "EXHIBIT A COLLECTION",
  "STICKERS - TEES - POSTERS",
];

export function MarqueeStrip() {
  const loop = [...messages, ...messages];
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {loop.map((item, idx) => (
          <span className="marquee-item" key={`${item}-${idx}`}>
            {item}
            <span className="marquee-sep">-</span>
          </span>
        ))}
      </div>
    </div>
  );
}