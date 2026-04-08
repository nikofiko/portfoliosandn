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
    platform: "google" as const,
    date: "3 miesiące temu",
  },
  {
    text: "Strona gotowa w 10 dni, ładniejsza niż u konkurencji. Szymon i Nikodem byli dostępni na każde pytanie. Idealne rozwiązanie dla małej firmy.",
    author: "Aleksandra Wierzbicka",
    role: "Studio Urody Ola, Warszawa",
    color: "#A78BFA",
    initials: "AW",
    platform: "trustpilot" as const,
    date: "6 tygodni temu",
  },
  {
    text: "Wcześniej płaciłem agencji 5000 zł i czekałem 3 miesiące. Tutaj za 800 zł dostałem lepszą stronę w dwa tygodnie. Polecam każdej firmie.",
    author: "Piotr Zając",
    role: "Kamex Remonty, Gdańsk",
    color: "#67E8F9",
    initials: "PZ",
    platform: "google" as const,
    date: "5 miesięcy temu",
  },
  {
    text: "Nie znałam się na stronach i nie musiałam. Chłopaki wszystko ogarnęli od A do Z. Klientki teraz umawiają się online — super sprawa.",
    author: "Katarzyna Nowak",
    role: "Gabinet Psychoterapii, Kraków",
    color: "#FDA4AF",
    initials: "KN",
    platform: "trustpilot" as const,
    date: "2 miesiące temu",
  },
  {
    text: "Moja stara strona nie działała na telefonie. Nowa wersja jest szybka, czysta i klienci od razu to zauważyli. Najlepsza inwestycja w tym roku.",
    author: "Jakub Wiśniewski",
    role: "Trattoria Bella, Wrocław",
    color: "#FBBF24",
    initials: "JW",
    platform: "google" as const,
    date: "7 tygodni temu",
  },
];

function GoogleLogo({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function TrustpilotLogo({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-label="Trustpilot">
      <rect width="24" height="24" rx="3" fill="#00B67A"/>
      <path d="M12 16.5l4.5-3.27-1.73-1.23L12 13.5l-2.77-1.5L7.5 13.23 12 16.5zM12 4l2.25 6.91H21l-5.63 4.09 2.15 6.62L12 17.54l-5.52 4.07 2.15-6.62L3 11.91h6.75L12 4z" fill="#fff"/>
    </svg>
  );
}

function TCard({ t }: { t: (typeof testimonials)[0] }) {
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
      {/* Platform badge — top right */}
      <div className={`t-platform t-platform-${t.platform}`}>
        {t.platform === "google" ? <GoogleLogo size={14} /> : <TrustpilotLogo size={14} />}
        <span>{t.platform === "google" ? "Google" : "Trustpilot"}</span>
      </div>

      <div className="t-item-quote" aria-hidden>&ldquo;</div>
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
          <div className="t-date">{t.date}</div>
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

      {/* Aggregate ratings bar */}
      <RevealOnScroll className="testi-agg" delay={2}>
        <div className="testi-agg-badge">
          <GoogleLogo size={20} />
          <div className="testi-agg-info">
            <div className="testi-agg-score">
              <span className="testi-agg-num">4.9</span>
              <span className="testi-agg-stars">★★★★★</span>
            </div>
            <div className="testi-agg-label">Google Reviews</div>
          </div>
        </div>
        <div className="testi-agg-sep" />
        <div className="testi-agg-badge">
          <TrustpilotLogo size={20} />
          <div className="testi-agg-info">
            <div className="testi-agg-score">
              <span className="testi-agg-num">5.0</span>
              <span className="testi-agg-stars testi-agg-stars-tp">★★★★★</span>
            </div>
            <div className="testi-agg-label">Trustpilot</div>
          </div>
        </div>
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
