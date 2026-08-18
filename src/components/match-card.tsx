import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Match } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("hr-HR", { weekday: "short", day: "2-digit", month: "short" });
const timeFormat = new Intl.DateTimeFormat("hr-HR", { hour: "2-digit", minute: "2-digit" });

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const date = new Date(match.kickoff);
  const played = match.status === "played";
  const upcoming = match.status === "scheduled";
  const statusLabel = match.status === "postponed" ? "Odgođeno" : match.status === "cancelled" ? "Otkazano" : played ? "Završeno" : "Slijedi";
  return (
    <article className={`match-card${upcoming ? " match-card-upcoming" : ""}${compact ? " compact" : ""}`}>
      <div className="match-meta"><span className={`status-pill status status-${match.status}`}>{statusLabel}</span><span>Uzrast {match.ageGroup}</span></div>
      <div className="match-teams">
        <strong>{match.homeTeam.name}</strong>
        <div className="score">{played ? <><b>{match.homeScore}</b><i>:</i><b>{match.awayScore}</b></> : <span>{timeFormat.format(date)}</span>}</div>
        <strong>{match.awayTeam.name}</strong>
      </div>
      <div className="match-details"><span><CalendarDays size={15} />{dateFormat.format(date)}</span><span><MapPin size={15} />{match.venue}</span></div>
      {!compact && <Link className="card-link" href={`/uzrasti/${match.ageGroup}`}>Detalji natjecanja <span aria-hidden="true">→</span></Link>}
    </article>
  );
}
