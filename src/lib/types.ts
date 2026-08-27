export type Stage = "league" | "playoff" | "playout";
export type MatchStatus = "scheduled" | "played" | "postponed" | "cancelled";
export type Visibility = "draft" | "public";

export type PointRules = { win: number; draw: number; loss: number };

export type Season = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  points: PointRules;
};

export type AgeGroup = {
  id: string;
  year: string;
  title: string;
  description: string;
  sortOrder: number;
  active: boolean;
};

export type Team = {
  id: string;
  name: string;
  shortName?: string;
  crest?: string;
  ageGroups: string[];
  active: boolean;
};

export type Player = {
  id: string;
  displayName: string;
  teamId: string;
  ageGroup: string;
  active: boolean;
};

export type ScorerEntry = {
  playerId?: string;
  playerName: string;
  teamId: string;
  goals: number;
};

export type Match = {
  id: string;
  title: string;
  seasonId: string;
  ageGroup: string;
  stage: Stage;
  round: string;
  kickoff: string;
  venue: string;
  status: MatchStatus;
  visibility: Visibility;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  scorers?: ScorerEntry[];
};

export type StandingRow = {
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type ScorerTotal = {
  playerId?: string;
  playerName: string;
  team: Team;
  goals: number;
};

export type Announcement = {
  id: string;
  type: "news" | "tournament" | "notice";
  title: string;
  excerpt: string;
  image: string;
  date: string;
  cta?: { label: string; href: string };
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Sponsor = {
  name: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  description: string;
  url?: string;
};

export type CompetitionData = {
  seasons: Season[];
  ageGroups: AgeGroup[];
  teams: Team[];
  players: Player[];
  matches: Match[];
};
