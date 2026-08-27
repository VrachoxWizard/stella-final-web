import Link from "next/link";
import { getAgeGroups } from "@/lib/content";

export async function AgeNavigation({ active }: { active?: string }) {
  const ageGroups = await getAgeGroups();
  return <nav className="age-navigation" aria-label="Odaberi uzrast">{ageGroups.map((group) => <Link key={group.year} aria-current={active === group.year ? "page" : undefined} className={active === group.year ? "active" : ""} href={`/uzrasti/${group.year}`}><span>U</span>{group.year}</Link>)}</nav>;
}
