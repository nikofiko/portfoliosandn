"use client";

import { useEffect, useRef } from "react";

export default function FloatingShapes() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const shapes = wrapRef.current?.querySelectorAll<HTMLDivElement>(".float-shape");
        shapes?.forEach((s, i) => {
          const speed = 0.02 + i * 0.012;
          const rotate = y * (0.01 + i * 0.005);
          s.style.transform = `translateY(${y * speed}px) rotate(${rotate}deg)`;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="float-shapes" ref={wrapRef}>
      <div className="float-shape" />
      <div className="float-shape" />
      <div className="float-shape" />
      <div className="float-shape" />
      <div className="float-shape" />
    </div>
  );
}
