import type { StandingRow } from "@/lib/types";

export function StandingsTable({ rows }: { rows: StandingRow[] }) {
  if (!rows.length) return <div className="empty-state">Tablica će se prikazati nakon prvih odigranih utakmica.</div>;
  return <div className="table-wrap"><table className="standings-table"><caption className="sr-only">Poredak momčadi</caption><thead><tr><th scope="col">#</th><th scope="col">Momčad</th><th scope="col" title="Odigrano">O</th><th scope="col" title="Pobjede">P</th><th scope="col" title="Neriješeno">N</th><th scope="col" title="Porazi">I</th><th scope="col">Golovi</th><th scope="col" title="Gol razlika">GR</th><th scope="col">Bod</th></tr></thead><tbody>{rows.map((row, index) => <tr key={row.team.id}><td><span className={`rank rank-${index + 1}`}>{index + 1}</span></td><th scope="row">{row.team.name}</th><td>{row.played}</td><td>{row.wins}</td><td>{row.draws}</td><td>{row.losses}</td><td>{row.goalsFor}:{row.goalsAgainst}</td><td>{row.goalDifference > 0 ? "+" : ""}{row.goalDifference}</td><td><strong>{row.points}</strong></td></tr>)}</tbody></table></div>;
}
