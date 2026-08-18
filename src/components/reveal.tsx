"use client";

import { useEffect, useRef } from "react";

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    node.classList.add("reveal-ready");
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      node.classList.add("is-visible");
      observer.unobserve(node);
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`reveal ${className ?? ""}`} style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}>{children}</div>;
}
