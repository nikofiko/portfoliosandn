"use client";

import { useEffect, useState } from "react";

// Phases:
// 0 = empty 404
// 1 = nav appears
// 2 = hero image + headline
// 3 = description + CTA
// 4 = features grid
// 5 = hold complete
const TIMINGS = [900, 400, 450, 400, 450, 2000];

export default function BuildFromScratch() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let t: ReturnType<typeof setTimeout> | null = null;

    const schedule = (p: number) => {
      if (cancelled) return;
      setPhase(p);
      const next = (p + 1) % TIMINGS.length;
      t = setTimeout(() => schedule(next), TIMINGS[p]);
    };

    schedule(0);

    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, []);

  const cls = (threshold: number) => `build-el${phase >= threshold ? " on" : ""}`;

  return (
    <div className="build-anim">
      {/* Empty state */}
      <div className={`build-empty${phase === 0 ? " on" : ""}`}>
        <div className="build-empty-icon">404</div>
        <div className="build-empty-text">
          brak strony<span className="build-blink">_</span>
        </div>
      </div>

      {/* Realistic website being built */}
      <div className={`bfs-site build-site${phase > 0 ? " on" : ""}`}>
        {/* Nav */}
        <div className={`bfs-nav ${cls(1)}`}>
          <div className="bfs-logo">
            <span className="bfs-logo-icon">🍕</span>
            <span className="bfs-logo-text">Bella Vista</span>
          </div>
          <div className="bfs-menu">
            <span>Menu</span>
            <span>O nas</span>
            <span>Rezerwacja</span>
          </div>
        </div>

        {/* Hero */}
        <div className={`bfs-hero ${cls(2)}`}>
          <div className="bfs-hero-img">
            <div className="bfs-hero-overlay">
              <div className="bfs-hero-tag">Restauracja Italiana</div>
              <div className="bfs-hero-h1">Smak Włoch<br/>w Twoim mieście</div>
            </div>
          </div>
        </div>

        {/* Description + CTA */}
        <div className={`bfs-info ${cls(3)}`}>
          <div className="bfs-desc">
            <div className="bfs-desc-ln" />
            <div className="bfs-desc-ln short" />
          </div>
          <div className="bfs-cta">Zarezerwuj stolik</div>
        </div>

        {/* Features grid */}
        <div className={`bfs-features build-grid${phase >= 4 ? " on" : ""}`}>
          <div className="bfs-feat">
            <div className="bfs-feat-icon">🍝</div>
            <div className="bfs-feat-label">Pasta</div>
          </div>
          <div className="bfs-feat">
            <div className="bfs-feat-icon">🍷</div>
            <div className="bfs-feat-label">Wino</div>
          </div>
          <div className="bfs-feat">
            <div className="bfs-feat-icon">🎂</div>
            <div className="bfs-feat-label">Desery</div>
          </div>
        </div>
      </div>
    </div>
  );
}
