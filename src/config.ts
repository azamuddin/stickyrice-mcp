import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

interface Config {
  apiKey: string;
  convexUrl: string;
}

const CONFIG_DIR = join(homedir(), ".config", "stickyrice-mcp");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function readConfig(): Config | null {
  try {
    if (!existsSync(CONFIG_FILE)) {
      return null;
    }
    const content = readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(content) as Config;
  } catch {
    return null;
  }
}

export function writeConfig(config: Config): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function deleteConfig(): void {
  try {
    if (existsSync(CONFIG_FILE)) {
      const { unlinkSync } = require("fs");
      unlinkSync(CONFIG_FILE);
    }
  } catch {
    // Ignore errors
  }
}

// Default Convex URL for Sticky Rice
export const DEFAULT_CONVEX_URL = "https://glad-dragon-481.convex.cloud";
