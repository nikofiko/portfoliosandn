"use client";

import { MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import RevealOnScroll from "./ui/RevealOnScroll";

type Project = {
  delay: 1 | 2 | 3 | 4 | 5;
  imgBg: string;
  mock: ReactNode;
  cat: string;
  name: string;
  desc?: string;
  result: string;
  type: string;
};

/* ── shared browser chrome ── */
function MockShell({
  url,
  dark,
  children,
}: {
  url: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="mock"
      style={{
        background: dark ? "#1c1c1e" : "#fff",
        border: dark ? "1px solid rgba(255,255,255,.08)" : undefined,
        boxShadow: dark
          ? "0 8px 32px rgba(0,0,0,.4)"
          : "0 4px 20px rgba(0,0,0,.08)",
      }}
    >
      <div
        className="mock-bar"
        style={
          dark
            ? { background: "#111", borderBottom: "1px solid rgba(255,255,255,.06)" }
            : undefined
        }
      >
        <span className="mock-dot" style={{ background: "#ff5f57" }} />
        <span className="mock-dot" style={{ background: "#febc2e" }} />
        <span className="mock-dot" style={{ background: "#28c840" }} />
        <span
          className="mock-url"
          style={
            dark
              ? { background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.25)" }
              : undefined
          }
        >
          {url}
        </span>
      </div>
      <div className="pm">{children}</div>
    </div>
  );
}

/* ── image slider for multi-screenshot mocks ── */
function MockSlider({ images, url, dark }: { images: { src: string; alt: string }[]; url: string; dark?: boolean }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback((next: number) => {
    setIdx((next + images.length) % images.length);
  }, [images.length]);

  // auto-advance every 2.8 s
  useEffect(() => {
    timerRef.current = setTimeout(() => advance(idx + 1), 2800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [idx, advance]);

  return (
    <MockShell url={url} dark={dark}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              objectPosition: "top",
              position: i === 0 ? "relative" : "absolute",
              top: 0, left: 0,
              opacity: i === idx ? 1 : 0,
              transition: "opacity .55s cubic-bezier(.22,1,.36,1)",
            }}
          />
        ))}
        {/* dot indicators */}
        <div style={{ position: "absolute", bottom: 7, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 3 }}>
          {images.map((_, i) => (
            <span
              key={i}
              onClick={(e) => { e.stopPropagation(); if (timerRef.current) clearTimeout(timerRef.current); advance(i); }}
              style={{
                width: i === idx ? 18 : 6,
                height: 6,
                borderRadius: 3,
                background: i === idx ? "#fff" : "rgba(255,255,255,.45)",
                transition: "width .35s, background .35s",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,.4)",
              }}
            />
          ))}
        </div>
      </div>
    </MockShell>
  );
}

/* ── 1. Trattoria Bella ── */
function BellaMock() {
  return (
    <MockSlider
      url="trattoriabella.pl"
      images={[
        { src: "/projects/bella.png",        alt: "Trattoria Bella — strona główna" },
        { src: "/projects/bella-menu.png",   alt: "Trattoria Bella — menu" },
        { src: "/projects/bella-galeria.png", alt: "Trattoria Bella — galeria" },
      ]}
    />
  );
}

/* ── 2. Gabinet Psychoterapii ── */
function GabinetMock() {
  return (
    <MockSlider
      url="zdrowiekrakow.pl"
      images={[
        { src: "/projects/gabinet-hero.png",   alt: "Gabinet Psychoterapii — strona główna" },
        { src: "/projects/gabinet-oferta.png", alt: "Gabinet Psychoterapii — oferta" },
      ]}
    />
  );
}

/* ── 3. Studio Urody Ola ── */
function OlaMock() {
  return (
    <MockSlider
      url="studiourodyola.pl"
      images={[
        { src: "/projects/ola-hero.png",   alt: "Studio Urody Ola — strona główna" },
        { src: "/projects/ola-onas.png",   alt: "Studio Urody Ola — o nas" },
        { src: "/projects/ola-cennik.png", alt: "Studio Urody Ola — cennik" },
      ]}
    />
  );
}

/* ── 4. Serwis AGD Nowak ── */
function AgdMock() {
  return (
    <MockSlider
      url="agdnowak.pl"
      dark
      images={[
        { src: "/projects/agd-hero.png",     alt: "AGD Nowak — strona główna" },
        { src: "/projects/agd-dlaczego.png", alt: "AGD Nowak — dlaczego my" },
        { src: "/projects/agd-opinie.png",   alt: "AGD Nowak — opinie klientów" },
      ]}
    />
  );
}

/* ── 5. Kamex Remonty ── */
function KamexMock() {
  return (
    <MockSlider
      url="kamexremonty.pl"
      dark
      images={[
        { src: "/projects/kamex-hero.png",   alt: "Kamex Remonty — strona główna" },
        { src: "/projects/kamex-uslugi.png", alt: "Kamex Remonty — usługi" },
        { src: "/projects/kamex.png",        alt: "Kamex Remonty — realizacje" },
      ]}
    />
  );
}

/* ── project data ── */
const newProjects: Project[] = [
  {
    delay: 1,
    imgBg: "#1a0800",
    mock: <BellaMock />,
    cat: "Restauracja · Wrocław",
    name: "Trattoria Bella",
    desc: "Strona z systemem rezerwacji online i galerią dań.",
    result: "↑ 3× więcej rezerwacji",
    type: "Wizytówka",
  },
  {
    delay: 2,
    imgBg: "#e8ede8",
    mock: <GabinetMock />,
    cat: "Zdrowie · Kraków",
    name: "Zdrowie Kraków · Psychoterapia",
    result: "Pełny grafik w 2 tygodnie",
    type: "Landing",
  },
  {
    delay: 3,
    imgBg: "#f9e4f0",
    mock: <OlaMock />,
    cat: "Kosmetyka · Warszawa",
    name: "Studio Urody Ola",
    result: "2× wzrost rezerwacji",
    type: "Wizytówka",
  },
];

const refreshedProjects: Project[] = [
  {
    delay: 1,
    imgBg: "#0f172a",
    mock: <AgdMock />,
    cat: "Usługi · Poznań",
    name: "Serwis AGD Nowak",
    result: "+40% zapytań telefonicznych",
    type: "Rezerwacje",
  },
  {
    delay: 2,
    imgBg: "#0f0f10",
    mock: <KamexMock />,
    cat: "Budownictwo · Gdańsk",
    name: "Kamex Remonty",
    result: "Pozycja #1 w Google",
    type: "Usługowa",
  },
];

function PItem({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const img = e.currentTarget.querySelector<HTMLDivElement>(".p-item-img");
    if (!img) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    img.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 12}deg) scale(1.04)`;
  };

  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector<HTMLDivElement>(".p-item-img");
    if (img) img.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
  };

  return (
    <div
      ref={ref}
      className={`p-item reveal rd${p.delay}${visible ? " visible" : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="p-item-inner">
        <div className="p-item-img" style={{ background: p.imgBg }}>
          {p.mock}
        </div>
        <div className="p-item-info">
          <div className="p-item-left">
            <span className="p-item-cat">{p.cat}</span>
            <span className="p-item-name">{p.name}</span>
            {p.desc && <span className="p-item-desc">{p.desc}</span>}
            <span className="p-item-result">{p.result}</span>
          </div>
          <span className="p-item-type">{p.type}</span>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section className="portfolio-section" id="portfolio">
      <RevealOnScroll className="tag">Portfolio</RevealOnScroll>
      <RevealOnScroll as="h2" className="big-title" delay={1}>
        <>
          Wybrane <em>projekty</em>
        </>
      </RevealOnScroll>
      <div className="p-split">
        <div className="p-col" id="portfolio-nowe">
          <RevealOnScroll as="h3" className="p-col-title" delay={2}>
            <span className="p-col-icon">🚀</span> Nowe od zera
          </RevealOnScroll>
          <div className="p-col-list">
            {newProjects.map((p, i) => (
              <PItem key={i} p={p} />
            ))}
          </div>
        </div>
        <div className="p-col" id="portfolio-odnowione">
          <RevealOnScroll as="h3" className="p-col-title" delay={3}>
            <span className="p-col-icon">🔄</span> Odnowione
          </RevealOnScroll>
          <div className="p-col-list">
            {refreshedProjects.map((p, i) => (
              <PItem key={i} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
