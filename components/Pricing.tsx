"use client";

import { useEffect, useRef } from "react";
import RevealOnScroll from "./ui/RevealOnScroll";
import MagneticButton from "./ui/MagneticButton";
import Counter from "./ui/Counter";

const features = [
  "Do 4 podstron",
  "Responsywny design",
  "7–14 dni realizacji",
  "Bezpośredni kontakt",
  "Runda poprawek w cenie",
  "Pomoc z domeną i hostingiem",
  "30 dni wsparcia po starcie",
];

export default function Pricing() {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.querySelectorAll("li").forEach((li, i) => {
              setTimeout(() => li.classList.add("visible"), i * 120);
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
      <RevealOnScroll className="pricing-split" delay={2}>
        <div className="pricing-left">
          <div className="tag">Pakiet startowy</div>
          <div className="pricing-price">
            <Counter target={800} />
            <small> PLN</small>
          </div>
          <div className="pricing-compare">
            Agencje biorą za to samo <s>3000–8000 zł</s>
          </div>
          <p className="pricing-note">
            Kompletna strona internetowa — od projektu do wdrożenia. Szybko, uczciwie,
            bez pośredników.
          </p>
        </div>
        <div className="pricing-right">
          <ul ref={listRef}>
            {features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <MagneticButton href="#contact">
            Zamów stronę <span className="btn-arrow">→</span>
          </MagneticButton>
          <p className="pricing-payment">
            400 zł na start · 400 zł po oddaniu strony
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
