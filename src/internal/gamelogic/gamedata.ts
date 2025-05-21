const locations = [
  "americas",
  "europe",
  "africa",
  "asia",
  "australia",
  "antarctica",
] as const;

export type Location = (typeof locations)[number];

export function isValidLocation(loc?: string): loc is Location {
  const l = new Set<string>(locations);
  return typeof loc === "string" && l.has(loc);
}

const ranks = ["infantry", "cavalry", "artillery"] as const;

export type UnitRank = (typeof ranks)[number];

export function isValidRank(rank?: string): rank is UnitRank {
  const r = new Set<string>(ranks);
  return typeof rank === "string" && r.has(rank);
}

export type UnitMap = Record<number, Unit>;

export interface Unit {
  id: number;
  rank: UnitRank;
  location: Location;
}

export interface Player {
  username: string;
  units: UnitMap;
}

export interface ArmyMove {
  player: Player;
  units: Unit[];
  toLocation: Location;
}

export interface RecognitionOfWar {
  attacker: Player;
  defender: Player;
}
