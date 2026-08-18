import type { ScorerTotal } from "@/lib/types";

export function ScorersList({ scorers }: { scorers: ScorerTotal[] }) {
  if (!scorers.length) return <div className="empty-state">Strijelci će se prikazati nakon unosa zapisnika.</div>;
  return <ol className="scorers-list">{scorers.map((scorer, index) => <li key={`${scorer.playerName}-${scorer.team.id}`}><span className="scorer-rank">{String(index + 1).padStart(2, "0")}</span><div><strong>{scorer.playerName}</strong><small>{scorer.team.name}</small></div><span className="goal-total"><b>{scorer.goals}</b> {scorer.goals === 1 ? "gol" : "golova"}</span></li>)}</ol>;
}
