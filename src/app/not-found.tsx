import Link from "next/link";

export default function NotFound() { return <section className="page-hero" data-word="404"><div className="shell"><span className="eyebrow">Nema na rasporedu</span><h1>Stranica nije pronađena.</h1><p>Adresa se možda promijenila. Vratite se na početnu ili otvorite aktualni raspored.</p><div className="hero-actions"><Link className="button" href="/">Početna</Link><Link className="button button-outline" href="/raspored">Raspored</Link></div></div></section>; }
