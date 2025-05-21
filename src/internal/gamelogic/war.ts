import { GameState } from "./gamestate.js";
import { type RecognitionOfWar, type Unit } from "./gamedata.js";
import { getOverlappingLocation } from "./move.js";

export enum WarOutcome {
  NotInvolved,
  NoUnits,
  YouWon,
  OpponentWon,
  Draw,
}

export function unitsToPowerLevel(units: Unit[]): number {
  let power = 0;
  for (const unit of units) {
    switch (unit.rank) {
      case "artillery":
        power += 10;
        break;
      case "cavalry":
        power += 5;
        break;
      case "infantry":
        power += 1;
        break;
      default:
        const unreachable: never = unit.rank;
        return unreachable;
    }
  }
  return power;
}

export type WarResolution =
  | {
      result: WarOutcome.YouWon;
      winner: string;
      loser: string;
    }
  | {
      result: WarOutcome.OpponentWon;
      winner: string;
      loser: string;
    }
  | {
      result: WarOutcome.Draw;
      attacker: string;
      defender: string;
    }
  | { result: WarOutcome.NotInvolved }
  | { result: WarOutcome.NoUnits };

export function handleWar(gs: GameState, rw: RecognitionOfWar): WarResolution {
  console.log();
  console.log("==== War Declared ====");
  console.log(
    `${rw.attacker.username} has declared war on ${rw.defender.username}!`,
  );

  const player = gs.getPlayerSnap();

  if (player.username === rw.defender.username) {
    console.log(`${player.username}, you published the war.`);
    console.log("------------------------");
    return { result: WarOutcome.NotInvolved };
  }

  if (player.username !== rw.attacker.username) {
    console.log(`${player.username}, you are not involved in this war.`);
    console.log("------------------------");
    return { result: WarOutcome.NotInvolved };
  }

  const overlappingLocation = getOverlappingLocation(rw.attacker, rw.defender);
  if (!overlappingLocation) {
    console.log(
      "Error! No units are in the same location. No war will be fought.",
    );
    console.log("------------------------");
    return { result: WarOutcome.NoUnits };
  }

  const attackerUnits: Unit[] = Object.values(rw.attacker.units).filter(
    (unit) => unit.location === overlappingLocation,
  );
  const defenderUnits: Unit[] = Object.values(rw.defender.units).filter(
    (unit) => unit.location === overlappingLocation,
  );

  console.log(`${rw.attacker.username}'s units:`);
  for (const unit of attackerUnits) {
    console.log(`  * ${unit.rank}`);
  }

  console.log(`${rw.defender.username}'s units:`);
  for (const unit of defenderUnits) {
    console.log(`  * ${unit.rank}`);
  }

  const attackerPower = unitsToPowerLevel(attackerUnits);
  const defenderPower = unitsToPowerLevel(defenderUnits);

  console.log(`Attacker has a power level of ${attackerPower}`);
  console.log(`Defender has a power level of ${defenderPower}`);

  if (attackerPower > defenderPower) {
    console.log(`${rw.attacker.username} has won the war!`);
    if (player.username === rw.defender.username) {
      console.log("You have lost the war!");
      gs.removeUnitsInLocation(overlappingLocation);
      console.log(`Your units in ${overlappingLocation} have been killed.`);
      console.log("------------------------");
      return {
        result: WarOutcome.OpponentWon,
        winner: rw.attacker.username,
        loser: rw.defender.username,
      };
    }
    console.log("------------------------");
    return {
      result: WarOutcome.YouWon,
      winner: rw.attacker.username,
      loser: rw.defender.username,
    };
  } else if (attackerPower < defenderPower) {
    console.log(`${rw.defender.username} has won the war!`);
    if (player.username === rw.attacker.username) {
      console.log("You have lost the war!");
      gs.removeUnitsInLocation(overlappingLocation);
      console.log(`Your units in ${overlappingLocation} have been killed.`);
      console.log("------------------------");
      return {
        result: WarOutcome.OpponentWon,
        winner: rw.defender.username,
        loser: rw.attacker.username,
      };
    }
    console.log("------------------------");
    return {
      result: WarOutcome.YouWon,
      winner: rw.defender.username,
      loser: rw.attacker.username,
    };
  }

  console.log("The war ended in a draw!");
  console.log(`Your units in ${overlappingLocation} have been killed.`);
  gs.removeUnitsInLocation(overlappingLocation);
  console.log("------------------------");
  return {
    result: WarOutcome.Draw,
    attacker: rw.attacker.username,
    defender: rw.defender.username,
  };
}
