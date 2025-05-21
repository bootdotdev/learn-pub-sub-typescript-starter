import type { Player, Unit, Location } from "./gamedata.js";

export interface PlayingState {
  isPaused: boolean;
}

export class GameState {
  private player: Player;
  private paused: boolean;

  constructor(username: string) {
    this.player = {
      username,
      units: {},
    };
    this.paused = false;
  }

  resumeGame(): void {
    this.paused = false;
  }

  pauseGame(): void {
    this.paused = true;
  }

  isPaused(): boolean {
    return this.paused;
  }

  addUnit(u: Unit): void {
    this.player.units[u.id] = u;
  }

  removeUnitsInLocation(loc: Location): void {
    for (const [id, unit] of Object.entries(this.player.units)) {
      if (unit.location === loc) {
        delete this.player.units[Number(id)];
      }
    }
  }

  updateUnit(u: Unit): void {
    this.player.units[u.id] = u;
  }

  getUsername(): string {
    return this.player.username;
  }

  getUnitsSnap(): Unit[] {
    return Object.values(this.player.units);
  }

  getUnit(id: number): Unit | undefined {
    return this.player.units[id];
  }

  getPlayerSnap(): Player {
    const unitsCopy: Record<number, Unit> = {};
    for (const [id, unit] of Object.entries(this.player.units)) {
      unitsCopy[Number(id)] = { ...unit };
    }
    return {
      username: this.player.username,
      units: unitsCopy,
    };
  }
}
