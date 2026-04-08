export default function Ticker() {
  const items = [
    "Strony wizytówki",
    "Landing page",
    "Strony usługowe",
    "Odświeżanie stron",
    "Responsywny design",
    "Szybka realizacja",
  ];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {[...items, ...items].map((text, i) => (
          <span className="ticker-item" key={i}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
