/** Loads worker/.env into process.env for the Mac-side scripts (they run outside the worker dir). */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const loadEnv = () => {
  const p = join(import.meta.dir, "..", "worker", ".env");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v0] = m as unknown as [string, string, string];
    if (process.env[k] === undefined) process.env[k] = v0.replace(/^["']|["']$/g, "");
  }
};

export const need = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} missing (worker/.env)`);
  return v;
};

export const workerUrl = () => need("WORKER_URL").replace(/\/+$/, "");
