import {
  isValidLocation,
  isValidRank,
  type Location,
  type UnitRank,
} from "./gamedata.js";
import type { GameState } from "./gamestate.js";

export function commandSpawn(gs: GameState, words: string[]) {
  if (words.length < 3) {
    throw new Error("usage: spawn <location> <rank>");
  }

  const locationName = words[1];
  if (!isValidLocation(locationName)) {
    throw new Error(`error: ${locationName} is not a valid location`);
  }

  const rank = words[2];
  if (!isValidRank(rank)) {
    throw new Error(`error: ${rank} is not a valid unit`);
  }

  const id = gs.getUnitsSnap().length + 1;
  const unit = { id, rank, location: locationName };
  gs.addUnit(unit);

  console.log(`Spawned a(n) ${rank} in ${locationName} with id ${id}`);
}
