import fs from "node:fs";
export function info(message) {
    fs.writeSync(1, `${message}\n`);
}
export function warn(message) {
    fs.writeSync(2, `${message}\n`);
}
export function fail(message) {
    fs.writeSync(2, `${message}\n`);
    process.exit(1);
}
//# sourceMappingURL=logger.mjs.map