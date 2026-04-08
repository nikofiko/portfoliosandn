import BeforeAfter from "./BeforeAfter";
import BuildFromScratch from "./BuildFromScratch";
import RevealOnScroll from "./ui/RevealOnScroll";

/** Odnowiona wersja — czysta, nowoczesna strona firmy remontowej */
function MockNew() {
  return (
    <div className="mnew">
      {/* nav */}
      <div className="mnew-nav">
        <div className="mnew-logo">
          <span className="mnew-logo-mark">K</span>
          <span className="mnew-logo-txt">Kamex Remonty</span>
        </div>
        <div className="mnew-links">
          <span>Oferta</span>
          <span>Realizacje</span>
          <span>Kontakt</span>
        </div>
      </div>
      {/* hero */}
      <div className="mnew-hero">
        <div className="mnew-hero-bg" />
        <div className="mnew-hero-content">
          <div className="mnew-hero-tag">Remonty &amp; wykończenia</div>
          <div className="mnew-hero-h">Zmieniamy przestrzeń,<br/>tworzymy wnętrza.</div>
          <div className="mnew-hero-btn">Bezpłatna wycena →</div>
        </div>
      </div>
      {/* stats */}
      <div className="mnew-stats">
        <div className="mnew-stat">
          <span className="mnew-stat-num">120+</span>
          <span className="mnew-stat-label">Realizacji</span>
        </div>
        <div className="mnew-stat">
          <span className="mnew-stat-num">8 lat</span>
          <span className="mnew-stat-label">Doświadczenia</span>
        </div>
        <div className="mnew-stat">
          <span className="mnew-stat-num">5.0</span>
          <span className="mnew-stat-label">⭐ Ocena</span>
        </div>
      </div>
    </div>
  );
}

/** Stara strona — tragicznie brzydka, prawdziwy koszmar z 2005 */
function MockOld() {
  return (
    <div className="mold">
      {/* Tiled bg is set via CSS */}
      {/* IE-style toolbar */}
      <div className="mold-toolbar">
        <div className="mold-toolbar-btns">
          <span>←</span>
          <span>→</span>
          <span>🏠</span>
        </div>
        <div className="mold-toolbar-url">
          http://kamex-remonty.republika.pl
        </div>
      </div>
      {/* Marquee banner */}
      <div className="mold-marquee">
        <div className="mold-marquee-track">
          ★★★ WITAMY NA STRONIE FIRMY KAMEX REMONTY !!! ZAPRASZAMY DO WSPÓŁPRACY ★★★&nbsp;&nbsp;&nbsp;
          ★★★ WITAMY NA STRONIE FIRMY KAMEX REMONTY !!! ZAPRASZAMY DO WSPÓŁPRACY ★★★&nbsp;&nbsp;&nbsp;
        </div>
      </div>
      {/* Under construction */}
      <div className="mold-construct">
        <span className="mold-construct-icon">🚧</span>
        STRONA W BUDOWIE
        <span className="mold-construct-icon">🚧</span>
      </div>
      {/* Table layout body */}
      <div className="mold-body">
        <div className="mold-sidebar">
          <div className="mold-sidebar-title">MENU:</div>
          <div className="mold-sidebar-link">→ Strona główna</div>
          <div className="mold-sidebar-link">→ O firmie</div>
          <div className="mold-sidebar-link">→ Usługi</div>
          <div className="mold-sidebar-link">→ Galeria</div>
          <div className="mold-sidebar-link hot">→ KONTAKT !!!</div>
        </div>
        <div className="mold-main">
          <div className="mold-title">KAMEX REMONTY</div>
          <div className="mold-subtitle">Firma remontowo-budowlana</div>
          <div className="mold-text-ln" />
          <div className="mold-text-ln short" />
          <div className="mold-text-ln" />
          <div className="mold-img-placeholder">
            <span>[ ZDJĘCIE ]</span>
            <span className="mold-broken">⚠ img not found</span>
          </div>
        </div>
      </div>
      {/* Footer with everything wrong */}
      <div className="mold-footer">
        <span className="mold-blink">✉</span>
        kamex_remonty@poczta.onet.pl
        <span className="mold-counter">Odwiedziny: 00047</span>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="services-section" id="services">
      <RevealOnScroll className="tag">Co robimy</RevealOnScroll>
      <RevealOnScroll as="h2" className="big-title" delay={1}>
        <>
          Nowe strony <em>&amp;</em>
          <br />
          odświeżanie istniejących
        </>
      </RevealOnScroll>
      <div className="svc-grid">
        <RevealOnScroll className="svc-card" delay={2}>
          <div className="svc-icon">🚀</div>
          <div className="svc-title">Nowy projekt od zera</div>
          <div className="svc-desc">
            Kompletna strona dopasowana do Twojej firmy. Od pustego miejsca do gotowej
            strony — projekt, wdrożenie, start.
          </div>
          <BuildFromScratch />
          <a href="#portfolio-nowe" className="svc-link">
            Zobacz przykłady
            <svg viewBox="0 0 24 24" width="14" height="14"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        </RevealOnScroll>
        <RevealOnScroll className="svc-card" delay={3}>
          <div className="svc-icon">🔄</div>
          <div className="svc-title">Odświeżenie istniejącej</div>
          <div className="svc-desc">
            Twoja strona wygląda jak z 2005? Przerabiamy ją na nowoczesną wersję,
            zachowując to, co działa.
          </div>
          <BeforeAfter before={<MockOld />} after={<MockNew />} />
          <a href="#portfolio-odnowione" className="svc-link">
            Zobacz przykłady
            <svg viewBox="0 0 24 24" width="14" height="14"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </a>
        </RevealOnScroll>
      </div>
    </section>
  );
}
