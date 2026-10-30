"use client";

import { createContext, useContext } from "react";

const RawImageBase = createContext<string | null>(null);

export function AdminProvider({ rawImageBase, children }: { rawImageBase: string | null; children: React.ReactNode }) {
  return <RawImageBase.Provider value={rawImageBase}>{children}</RawImageBase.Provider>;
}

/**
 * A freshly uploaded photo lives in GitHub before Vercel finishes the new deploy,
 * so previews fall back to the raw GitHub copy when the live site does not have it yet.
 */
export function AdminImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const rawBase = useContext(RawImageBase);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} loading="lazy" onError={(event) => {
    const image = event.currentTarget;
    if (!rawBase || !src.startsWith("/") || image.dataset.fallback) return;
    image.dataset.fallback = "1";
    image.src = `${rawBase}${src}`;
  }} />;
}
