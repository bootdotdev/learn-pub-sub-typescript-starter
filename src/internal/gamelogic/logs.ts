import { appendFile } from "fs/promises";

export interface GameLog {
  currentTime: Date;
  message: string;
  username: string;
}

const logsFile = "game.log";
const writeToDiskSleep = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function writeLog(gameLog: GameLog): Promise<void> {
  console.log("received game log...");
  await sleep(writeToDiskSleep);

  const date = new Date(gameLog.currentTime);
  const timestamp = date.toISOString();
  const logEntry = `${timestamp} ${gameLog.username}: ${gameLog.message}\n`;

  try {
    await appendFile(logsFile, logEntry, { flag: "a" });
  } catch (err) {
    throw new Error(`could not write to logs file: ${err}`);
  }
}
