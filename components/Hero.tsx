"use client";

import { MouseEvent } from "react";
import MagneticButton from "./ui/MagneticButton";
import Counter from "./ui/Counter";

export default function Hero() {
  const onTileMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--tx",
      `${((e.clientX - r.left) / r.width) * 100}%`
    );
    e.currentTarget.style.setProperty(
      "--ty",
      `${((e.clientY - r.top) / r.height) * 100}%`
    );
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-number">01</span>
        <div className="hero-tag">Web Development Studio</div>
        <h1>
          <span className="hero-line">
            <span className="hero-line-inner">Budujemy</span>
          </span>
          <span className="hero-line">
            <span className="hero-line-inner">strony dla</span>
          </span>
          <span className="hero-line">
            <span className="hero-line-inner">
              <em>lokalnych</em>
            </span>
          </span>
          <span className="hero-line">
            <span className="hero-line-inner">firm.</span>
          </span>
        </h1>
        <p className="hero-desc">
          <strong>Profesjonalnie, szybko i w cenie od 750 PLN.</strong> Bez agencji, bez
          pośredników — tylko my i Twój projekt.
        </p>
        <div className="hero-actions">
          <MagneticButton href="#pricing">
            Sprawdź ofertę <span className="btn-arrow">→</span>
          </MagneticButton>
          <a href="#portfolio" className="btn-outline">
            Zobacz projekty
          </a>
        </div>
        <div className="hero-social">
          <div className="avatars">
            <span>MK</span>
            <span>AW</span>
            <span>PZ</span>
            <span>KN</span>
          </div>
          <p className="social-text">
            <strong>12+ zadowolonych klientów</strong>
            <br />
            lokalnych firm z całej Polski
          </p>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-blob">
          <svg viewBox="0 0 400 400">
            <path d="M220,100 C280,40 340,120 300,200 C260,280 180,320 120,260 C60,200 100,80 160,60 C180,52 200,60 220,100Z" />
          </svg>
        </div>
        <div className="hero-grid">
          <div className="hero-tile" onMouseMove={onTileMove}>
            <div className="hero-tile-num">
              <Counter target={15} suffix="+" />
            </div>
            <div className="hero-tile-label">Projektów</div>
          </div>
          <div className="hero-tile" onMouseMove={onTileMove}>
            <div className="hero-tile-num">
              <Counter target={750} />
            </div>
            <div className="hero-tile-label">PLN od</div>
          </div>
          <div className="hero-tile" onMouseMove={onTileMove}>
            <div className="hero-tile-num">7–14</div>
            <div className="hero-tile-label">Dni</div>
          </div>
          <div className="hero-tile" onMouseMove={onTileMove}>
            <div className="hero-tile-num">
              <Counter target={100} suffix="%" />
            </div>
            <div className="hero-tile-label">Zadowolenia</div>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Przewiń</span>
          <div className="scroll-arrow" />
        </div>
      </div>
    </section>
  );
}
