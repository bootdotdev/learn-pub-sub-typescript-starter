import readline from "readline";
import { GameState } from "./gamestate.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function printClientHelp(): void {
  console.log("Possible commands:");
  console.log("* move <location> <unitID> <unitID> <unitID>...");
  console.log("    example:");
  console.log("    move asia 1");
  console.log("* spawn <location> <rank>");
  console.log("    example:");
  console.log("    spawn europe infantry");
  console.log("* status");
  console.log("* spam <n>");
  console.log("    example:");
  console.log("    spam 5");
  console.log("* quit");
  console.log("* help");
}

export async function clientWelcome(): Promise<string> {
  console.log("Welcome to the Peril client!");
  const words = await getInput("Please enter your username:\n");
  if (words.length === 0) {
    throw new Error("you must enter a username. goodbye");
  }

  const username = words[0];
  if (!username) {
    throw new Error("you must enter a username. goodbye");
  }

  console.log(`Welcome, ${username}!`);
  printClientHelp();
  return username;
}

export function printServerHelp(): void {
  console.log("Possible commands:");
  console.log("* pause");
  console.log("* resume");
  console.log("* quit");
  console.log("* help");
}

export function getMaliciousLog(): string {
  const possibleLogs = [
    "Never interrupt your enemy when he is making a mistake.",
    "The hardest thing of all for a soldier is to retreat.",
    "A soldier will fight long and hard for a bit of colored ribbon.",
    "It is well that war is so terrible, otherwise we should grow too fond of it.",
    "The art of war is simple enough. Find out where your enemy is. Get at him as soon as you can. Strike him as hard as you can, and keep moving on.",
    "All warfare is based on deception.",
  ];
  const randomIndex = Math.floor(Math.random() * possibleLogs.length);
  return possibleLogs[randomIndex]!;
}

export function printQuit(): void {
  console.log("I hate this game! (╯°□°)╯︵ ┻━┻");
}

export function getInput(prompt: string = "> "): Promise<string[]> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const trimmed = answer.trim();
      const words = trimmed.split(/\s+/);
      resolve(words);
    });
  });
}

export async function commandStatus(gs: GameState): Promise<void> {
  if (gs.isPaused()) {
    console.log("The game is paused.");
    return;
  } else {
    console.log("The game is not paused.");
  }

  const p = gs.getPlayerSnap();
  console.log(
    `You are ${p.username}, and you have ${Object.keys(p.units).length} units.`,
  );

  for (const unit of Object.values(p.units)) {
    console.log(`* ${unit.id}: ${unit.location}, ${unit.rank}`);
  }
}
