"use client";

import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
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

const newProjects: Project[] = [
  {
    delay: 1,
    imgBg: "#f5ede6",
    mock: (
      <div className="mock" style={{ maxWidth: 420 }}>
        <div className="mock-bar">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
        </div>
        <div className="mock-body">
          <div className="mock-ln accent-ln" style={{ width: "40%", height: 8 }} />
          <div
            className="mock-img"
            style={{ background: "linear-gradient(135deg,#e8d5c8,#d4b8a8)" }}
          />
          <div className="mock-ln m" />
          <div className="mock-ln s" />
          <div
            className="mock-ln"
            style={{
              width: "35%",
              height: 20,
              background: "#141210",
              borderRadius: 100,
              marginTop: 3,
            }}
          />
        </div>
      </div>
    ),
    cat: "Restauracja · Wrocław",
    name: "Trattoria Bella",
    desc: "Strona z systemem rezerwacji online i galerią dań.",
    result: "↑ 3× więcej rezerwacji",
    type: "Wizytówka",
  },
  {
    delay: 2,
    imgBg: "#F0FDF4",
    mock: (
      <div className="mock">
        <div className="mock-bar">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
        </div>
        <div className="mock-body">
          <div
            className="mock-ln"
            style={{ width: "60%", background: "#16A34A", opacity: 0.35, height: 7 }}
          />
          <div
            className="mock-img"
            style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)" }}
          />
          <div className="mock-ln m" />
        </div>
      </div>
    ),
    cat: "Zdrowie · Kraków",
    name: "Gabinet Psychoterapii",
    result: "Pełny grafik w 2 tygodnie",
    type: "Landing",
  },
  {
    delay: 3,
    imgBg: "#FDF2F8",
    mock: (
      <div className="mock">
        <div className="mock-bar">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
        </div>
        <div className="mock-body">
          <div
            className="mock-ln"
            style={{ width: "50%", background: "#A855F7", opacity: 0.35, height: 7 }}
          />
          <div
            className="mock-img"
            style={{ background: "linear-gradient(135deg,#fae8ff,#e9d5ff)" }}
          />
          <div className="mock-ln m" />
        </div>
      </div>
    ),
    cat: "Kosmetyka · Warszawa",
    name: "Studio Urody Ola",
    result: "2× wzrost rezerwacji",
    type: "Wizytówka",
  },
];

const refreshedProjects: Project[] = [
  {
    delay: 1,
    imgBg: "#EBF4FF",
    mock: (
      <div className="mock">
        <div className="mock-bar">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
        </div>
        <div className="mock-body">
          <div
            className="mock-ln"
            style={{ width: "55%", background: "#3B82F6", opacity: 0.4, height: 7 }}
          />
          <div
            className="mock-img"
            style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)" }}
          />
          <div className="mock-ln m" />
          <div className="mock-ln s" />
        </div>
      </div>
    ),
    cat: "Usługi · Poznań",
    name: "Serwis AGD Nowak",
    result: "+40% zapytań telefonicznych",
    type: "Rezerwacje",
  },
  {
    delay: 2,
    imgBg: "#FFF7ED",
    mock: (
      <div className="mock">
        <div className="mock-bar">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
        </div>
        <div className="mock-body">
          <div
            className="mock-ln"
            style={{ width: "45%", background: "#F59E0B", opacity: 0.4, height: 7 }}
          />
          <div
            className="mock-img"
            style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)" }}
          />
          <div className="mock-ln m" />
        </div>
      </div>
    ),
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
    const inner = e.currentTarget.querySelector<HTMLDivElement>(".p-item-inner");
    if (!inner) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector<HTMLDivElement>(".p-item-inner");
    if (inner) inner.style.transform = "rotateY(0) rotateX(0)";
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
          <div
            style={{
              display: "flex",
              gap: ".5rem",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span className="p-item-type">{p.type}</span>
            <div className="p-item-arrow">
              <svg viewBox="0 0 24 24">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </div>
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
