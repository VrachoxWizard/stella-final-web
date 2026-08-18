import Link from "next/link";
import { ageGroups } from "@/lib/data";

export function AgeNavigation({ active }: { active?: string }) {
  return <nav className="age-navigation" aria-label="Odaberi uzrast">{ageGroups.map((group) => <Link key={group.year} aria-current={active === group.year ? "page" : undefined} className={active === group.year ? "active" : ""} href={`/uzrasti/${group.year}`}><span>U</span>{group.year}</Link>)}</nav>;
}
