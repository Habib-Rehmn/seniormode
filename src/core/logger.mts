import fs from "node:fs";

export function info(message: string): void {
  fs.writeSync(1, `${message}\n`);
}

export function warn(message: string): void {
  fs.writeSync(2, `${message}\n`);
}

export function fail(message: string): never {
  fs.writeSync(2, `${message}\n`);
  process.exit(1);
}
