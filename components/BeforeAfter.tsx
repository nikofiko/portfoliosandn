"use client";

import { PointerEvent, ReactNode, useCallback, useRef, useState } from "react";

type Props = {
  before: ReactNode; // stara wersja — prawa strona
  after: ReactNode; // nowa wersja — lewa strona
};

export default function BeforeAfter({ before, after }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    updateFromClientX(e.clientX);
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  return (
    <div
      ref={wrapRef}
      className="ba-slider"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* STARA — pełna pod spodem */}
      <div className="ba-layer ba-layer-before">{before}</div>
      {/* NOWA — przycięta od prawej */}
      <div
        className="ba-layer ba-layer-after"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {after}
      </div>

      {/* etykiety */}
      <div className="ba-tag ba-tag-new">Nowa</div>
      <div className="ba-tag ba-tag-old">Stara</div>

      {/* suwak */}
      <div className="ba-divider" style={{ left: `${pos}%` }}>
        <div className="ba-handle" aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path
              d="M8 7l-4 5 4 5M16 7l4 5-4 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
