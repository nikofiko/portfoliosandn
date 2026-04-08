"use client";

import { MouseEvent } from "react";

export default function Navbar() {
  const smoothScroll = (e: MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#") || href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav>
      <a href="#" className="nav-logo">
        S<span>&amp;</span>N
      </a>
      <ul className="nav-center">
        <li>
          <a href="#services" onClick={smoothScroll}>
            Co robimy
          </a>
        </li>
        <li>
          <a href="#portfolio" onClick={smoothScroll}>
            Realizacje
          </a>
        </li>
        <li>
          <a href="#pricing" onClick={smoothScroll}>
            Cennik
          </a>
        </li>
        <li>
          <a href="#about" onClick={smoothScroll}>
            O nas
          </a>
        </li>
        <li>
          <a href="#contact" onClick={smoothScroll}>
            Kontakt
          </a>
        </li>
      </ul>
      <div className="nav-right">
        <a href="#contact" onClick={smoothScroll}>
          Napisz do nas →
        </a>
      </div>
    </nav>
  );
}
