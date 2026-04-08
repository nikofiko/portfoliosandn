"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import RevealOnScroll from "./ui/RevealOnScroll";

export default function About() {
  const sigRef = useRef<HTMLDivElement | null>(null);
  const [sigVisible, setSigVisible] = useState(false);
  const visualRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sigRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSigVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = visualRef.current;
    const card = cardRef.current;
    if (!el || !card) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const ry = (-(e.clientY - r.top) / r.height + 0.5) * 12;
    card.style.transform = `rotateY(${rx}deg) rotateX(${ry}deg)`;
  };

  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "rotateY(0) rotateX(0)";
  };

  return (
    <section className="about-section" id="about">
      <div className="about-text">
        <RevealOnScroll className="tag">O nas</RevealOnScroll>
        <RevealOnScroll as="h2" className="big-title" delay={1}>
          <>
            Szymon <em>&amp;</em> Nikodem
          </>
        </RevealOnScroll>
        <RevealOnScroll as="p" delay={2}>
          Jesteśmy dwójką młodych web developerów, którzy zaczęli robić strony dla
          znajomych, a teraz pomagają lokalnym firmom zaistnieć w internecie.
        </RevealOnScroll>
        <RevealOnScroll as="p" delay={3}>
          <>
            Nie jesteśmy agencją z działem marketingu. Jesteśmy{" "}
            <strong>bezpośrednim kontaktem</strong> — piszesz do nas, to my piszemy z
            powrotem. Wierzymy, że{" "}
            <strong>mały biznes zasługuje na profesjonalną stronę</strong> bez
            przepłacania.
          </>
        </RevealOnScroll>
        <RevealOnScroll className="about-sig" delay={4}>
          <div
            className={`about-sig-line${sigVisible ? " visible" : ""}`}
            ref={sigRef}
          />
          <span className="about-sig-text">Szymon &amp; Nikodem</span>
        </RevealOnScroll>
      </div>
      <RevealOnScroll
        className="about-visual"
        delay={2}
      >
        <div
          ref={visualRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ position: "relative" }}
        >
          <div className="about-card-offset" />
          <div className="about-card" ref={cardRef}>
            <div className="about-card-avatar">Zdjęcie</div>
            <div className="about-card-name">S&amp;N Studio</div>
            <div className="about-card-role">Web Development</div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
