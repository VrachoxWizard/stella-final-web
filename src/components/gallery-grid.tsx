"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/types";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTrigger = useRef(0);
  const selected = selectedIndex === null ? null : images[selectedIndex];
  const isOpen = selectedIndex !== null;

  const close = useCallback(() => {
    setSelectedIndex(null);
    window.setTimeout(() => triggerRefs.current[lastTrigger.current]?.focus(), 0);
  }, []);
  const previous = useCallback(() => setSelectedIndex((index) => index === null ? null : (index - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setSelectedIndex((index) => index === null ? null : (index + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); return; }
      if (event.key === "ArrowRight") { event.preventDefault(); next(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.classList.add("lightbox-open");
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.classList.remove("lightbox-open"); };
  }, [isOpen, close, previous, next]);

  return <>
    <div className="gallery-grid">{images.map((image, index) => <button ref={(node) => { triggerRefs.current[index] = node; }} type="button" className="gallery-item" key={image.id} aria-label={`Otvori fotografiju: ${image.alt}`} onClick={() => { lastTrigger.current = index; setSelectedIndex(index); }}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 66vw" /></button>)}</div>
    {selected && <div ref={dialogRef} className="lightbox" role="dialog" aria-modal="true" aria-label={selected.alt} onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }}>
      <button ref={closeRef} className="lightbox-close" type="button" aria-label="Zatvori fotografiju" onClick={close}><X /></button>
      <button className="lightbox-nav lightbox-previous" type="button" aria-label="Prethodna fotografija" onClick={previous}><ChevronLeft /></button>
      <figure className="lightbox-figure"><div className="lightbox-image"><Image src={selected.src} alt={selected.alt} fill sizes="100vw" /></div><figcaption aria-live="polite"><span>{selectedIndex! + 1} / {images.length}</span>{selected.alt}</figcaption></figure>
      <button className="lightbox-nav lightbox-next" type="button" aria-label="Sljedeća fotografija" onClick={next}><ChevronRight /></button>
    </div>}
  </>;
}
