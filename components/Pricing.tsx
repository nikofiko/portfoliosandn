"use client";

import RevealOnScroll from "./ui/RevealOnScroll";
import MagneticButton from "./ui/MagneticButton";
import Counter from "./ui/Counter";

const gmailLink = (planName: string, price: string) => {
  const su = encodeURIComponent(`Zapytanie: ${planName} (${price})`);
  const body = encodeURIComponent(
    `Dzień dobry,\n\nJestem zainteresowany/a pakietem „${planName}" (${price}).\n\nPozdrawiam`
  );
  return `https://mail.google.com/mail/?view=cm&to=nikodem@sandnstudio.art&su=${su}&body=${body}`;
};

const plans = [
  {
    tag: "Starter",
    name: "Landing Page",
    subtitle: "One-pager",
    price: 750,
    unit: "PLN",
    desc: "Elegancka strona jednostronicowa — szybka prezentacja firmy w jednym scrollu.",
    features: [
      "1 strona (scroll)",
      "Responsywny design",
      "7–10 dni realizacji",
      "Formularz kontaktowy",
      "Pomoc z domeną i hostingiem",
    ],
    payment: "375 zł na start · 375 zł po oddaniu",
    popular: false,
    href: gmailLink("Landing Page", "750 zł"),
  },
  {
    tag: "Najpopularniejszy",
    name: "Strona Wizytówka",
    subtitle: "ok. 4 podstrony",
    price: 1250,
    unit: "PLN",
    desc: "Kompletna strona z osobnymi podstronami — oferta, o nas, realizacje, kontakt.",
    features: [
      "Do 4 podstron",
      "Responsywny design",
      "7–14 dni realizacji",
      "Runda poprawek w cenie",
      "Pomoc z domeną i hostingiem",
      "30 dni wsparcia po starcie",
    ],
    payment: "625 zł na start · 625 zł po oddaniu",
    popular: true,
    href: gmailLink("Strona Wizytówka", "1250 zł"),
  },
  {
    tag: "Pro",
    name: "System Rezerwacji",
    subtitle: "WordPress + Bookly/Amelia",
    price: 2000,
    unit: "PLN",
    desc: "Strona z wbudowanym bookingiem online — klienci umawiają się bez Twojego udziału.",
    features: [
      "Do 4 podstron",
      "System rezerwacji online",
      "Integracja płatności",
      "Szkolenie z obsługi",
      "30 dni wsparcia po starcie",
    ],
    payment: "1000 zł na start · 1000 zł po oddaniu",
    popular: false,
    href: gmailLink("System Rezerwacji", "2000 zł"),
  },
  {
    tag: "Subskrypcja",
    name: "Pakiet Opieki",
    subtitle: "miesięczna opieka",
    price: 75,
    unit: "PLN / mies.",
    desc: "Stała opieka techniczna nad Twoją stroną — bez niespodzianek, bez przestojów.",
    features: [
      "Aktualizacje oprogramowania",
      "Do 2h zmian miesięcznie",
      "Monitoring dostępności",
      "Priorytetowy kontakt",
      "Backup tygodniowy",
    ],
    payment: "Płatność co miesiąc · Anuluj kiedy chcesz",
    popular: false,
    href: gmailLink("Pakiet Opieki", "75 zł/mies."),
  },
];

export default function Pricing() {
  return (
    <section id="pricing">
      <RevealOnScroll className="tag">Cennik</RevealOnScroll>
      <RevealOnScroll as="h2" className="big-title" delay={1}>
        <>
          Prosta cena,
          <br />
          <em>zero ukrytych</em> kosztów.
        </>
      </RevealOnScroll>

      <div className="pricing-grid">
        {plans.map((plan, i) => (
          <RevealOnScroll
            key={plan.name}
            className={`p-card${plan.popular ? " p-card--popular" : ""}`}
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4 | 5}
          >
            <div className="p-card-top">
              <span className="p-card-tag">{plan.tag}</span>
              {plan.popular && <span className="p-card-badge">⭐ Polecamy</span>}
            </div>
            <div className="p-card-name">{plan.name}</div>
            <div className="p-card-sub">{plan.subtitle}</div>
            <div className="p-card-price">
              <Counter target={plan.price} />
              <small> {plan.unit}</small>
            </div>
            <p className="p-card-desc">{plan.desc}</p>
            <ul className="p-card-features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="p-card-footer">
              <MagneticButton href={plan.href} target="_blank" rel="noopener noreferrer">
                Zamów <span className="btn-arrow">→</span>
              </MagneticButton>
              <p className="p-card-payment">{plan.payment}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <RevealOnScroll className="pricing-note-global" delay={2}>
        Agencje biorą za to samo <s>3 000–8 000 zł</s> · My działamy bezpośrednio — bez pośredników.
      </RevealOnScroll>
    </section>
  );
}
