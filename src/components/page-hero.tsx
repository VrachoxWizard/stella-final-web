import Image from "next/image";

export function PageHero({ eyebrow, title, copy, word, image }: { eyebrow: string; title: string; copy: string; word: string; image?: string }) {
  return <header className="page-hero" data-word={word}>{image && <div className="page-hero-image"><Image src={image} alt="" fill sizes="100vw" preload /></div>}<div className="shell"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></header>;
}
