import Image from "next/image";
import type { Sponsor } from "@/lib/types";

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const artwork = <Image src={sponsor.image} width={sponsor.width} height={sponsor.height} alt={sponsor.alt} sizes="(max-width: 760px) calc(100vw - 28px), 1120px" />;
  return <div className="sponsor-card">
    {sponsor.url ? <a className="sponsor-artwork" href={sponsor.url} target="_blank" rel="noreferrer" aria-label={`Otvori stranicu sponzora ${sponsor.name}`}>{artwork}</a> : <div className="sponsor-artwork">{artwork}</div>}
    <div className="sponsor-caption"><span className="eyebrow">Partner uz mlade sportaše</span><h2>Zdravlje je dio svake pobjede.</h2><p>{sponsor.description}</p></div>
  </div>;
}
