import chalk from "chalk";
import { getEnv } from "./env.js";

const getTimestamp = () => {
  const now = new Date();
  return `[${now.toLocaleTimeString("id-ID", { hour12: false })}]`;
};

export const logInfo = (msg) => {
  if (getEnv("NODE_ENV") === "development") {
    console.log(chalk.blue(`${getTimestamp()} [INFO] ${msg}`));
  }
};

export const logSuccess = (msg) => {
  console.log(chalk.green(`${getTimestamp()} [SUCCESS] ${msg}`));
};

export const logWarn = (msg) => {
  if (getEnv("NODE_ENV") === "development") {
    console.log(chalk.yellow(`${getTimestamp()} [WARN] ${msg}`));
  }
};

export const logError = (msg) => {
  console.log(chalk.red(`${getTimestamp()} [ERROR] ${msg}`));
};
