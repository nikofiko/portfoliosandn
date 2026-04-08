"use client";

import { useCallback, useEffect, useState, ReactNode, ElementType, createElement } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: 1 | 2 | 3 | 4 | 5;
  threshold?: number;
};

export default function RevealOnScroll({
  as: Tag = "div",
  className = "",
  children,
  delay,
  threshold = 0.1,
}: Props) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const refCallback = useCallback((el: HTMLElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, threshold]);

  const classes = [
    "reveal",
    delay ? `rd${delay}` : "",
    visible ? "visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(Tag, { ref: refCallback, className: classes }, children);
}
