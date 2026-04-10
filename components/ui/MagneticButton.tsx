"use client";

import { useCallback, useRef, MouseEvent, ReactNode, ElementType, createElement } from "react";

type Props = {
  as?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function MagneticButton({
  as: Tag = "a",
  href,
  target,
  rel,
  className = "btn-magnetic",
  children,
  onClick,
  type,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
  }, []);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.transform = `translate(${(x - r.width / 2) * 0.2}px, ${(y - r.height / 2) * 0.2}px)`;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0,0)";
  };

  const props: Record<string, unknown> = {
    ref: setRef,
    className,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
  };
  if (Tag === "a") { props.href = href; props.target = target; props.rel = rel; }
  if (Tag === "button") props.type = type || "button";

  return createElement(Tag, props, children);
}
