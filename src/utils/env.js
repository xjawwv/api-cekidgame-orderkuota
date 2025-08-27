import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export function getEnv(key, defaultValue = null) {
  const envPath = path.resolve(process.cwd(), ".env");
  const envConfig = dotenv.parse(fs.readFileSync(envPath)); // selalu baca ulang
  return envConfig[key] ?? defaultValue;
}
