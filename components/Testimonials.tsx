"use client";

import {
  MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import RevealOnScroll from "./ui/RevealOnScroll";

const testimonials = [
  {
    text: "Szczerze nie spodziewałem się takiego rezultatu za taką cenę. Strona wyszła profesjonalnie, klienci mówią że znaleźli nas przez internet.",
    author: "Marek Kowalski",
    role: "Serwis AGD Nowak, Poznań",
    color: "#818CF8",
    initials: "MK",
  },
  {
    text: "Strona gotowa w 10 dni, ładniejsza niż u konkurencji. Szymon i Nikodem byli dostępni na każde pytanie. Idealne rozwiązanie.",
    author: "Aleksandra Wierzbicka",
    role: "Studio Urody Ola, Warszawa",
    color: "#A78BFA",
    initials: "AW",
  },
  {
    text: "Wcześniej płaciłem agencji 5000 zł i czekałem 3 miesiące. Tutaj za 500 zł dostałem lepszą stronę w dwa tygodnie. Polecam każdej firmie.",
    author: "Piotr Zając",
    role: "Kamex Remonty, Gdańsk",
    color: "#67E8F9",
    initials: "PZ",
  },
  {
    text: "Nie znałam się na stronach i nie musiałam. Chłopaki wszystko ogarnęli od A do Z. Klientki teraz umawiają się online.",
    author: "Katarzyna Nowak",
    role: "Gabinet Psychoterapii, Kraków",
    color: "#FDA4AF",
    initials: "KN",
  },
  {
    text: "Moja stara strona nie działała na telefonie. Nowa wersja jest szybka, czysta i klienci od razu to zauważyli. Najlepsza inwestycja w tym roku.",
    author: "Jakub Wiśniewski",
    role: "Trattoria Bella, Wrocław",
    color: "#FBBF24",
    initials: "JW",
  },
];

function TCard({
  t,
}: {
  t: (typeof testimonials)[0];
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-10px) scale(1.02)`;
  };

  const onLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = "rotateY(0) rotateX(0) translateY(0) scale(1)";
  };

  return (
    <div
      className="t-item"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ "--t-color": t.color } as React.CSSProperties}
    >
      <div className="t-item-quote" aria-hidden>
        &ldquo;
      </div>
      <div className="t-item-stars">
        {Array.from({ length: 5 }).map((_, s) => (
          <svg key={s} viewBox="0 0 20 20" width="14" height="14">
            <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.51.91-5.33L2.27 6.68l5.34-.78z" />
          </svg>
        ))}
      </div>
      <p className="t-item-text">{t.text}</p>
      <div className="t-item-footer">
        <div className="t-item-avatar" style={{ background: t.color }}>
          {t.initials}
        </div>
        <div>
          <div className="t-item-author">{t.author}</div>
          <div className="t-item-role">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [perView, setPerView] = useState(3);

  const computePerView = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const pv = computePerView();
    setPerView(pv);
    const firstCard = track.querySelector<HTMLDivElement>(".t-item");
    if (!firstCard) return;
    const gap = 24;
    const w = firstCard.getBoundingClientRect().width;
    const max = Math.max(0, testimonials.length - pv);
    const clamped = Math.min(idx, max);
    if (clamped !== idx) setIdx(clamped);
    track.style.transform = `translateX(-${clamped * (w + gap)}px)`;
  }, [idx]);

  useLayoutEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const max = Math.max(0, testimonials.length - perView);

  return (
    <section className="testi-section" id="testimonials">
      <RevealOnScroll className="tag">Opinie</RevealOnScroll>
      <RevealOnScroll as="h2" className="big-title" delay={1}>
        <>
          Co mówią <em>nasi klienci</em>
        </>
      </RevealOnScroll>
      <div className="testi-wrap">
        <div className="testi-track" ref={trackRef}>
          {testimonials.map((t, i) => (
            <TCard key={i} t={t} />
          ))}
        </div>
        <div className="slider-nav">
          <button
            className="slider-btn"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            aria-label="Poprzednia opinia"
          >
            ←
          </button>
          <button
            className="slider-btn"
            onClick={() => setIdx((i) => Math.min(max, i + 1))}
            aria-label="Następna opinia"
          >
            →
          </button>
          <div className="slider-dots">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <span
                key={i}
                className={`s-dot${i === idx ? " active" : ""}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
