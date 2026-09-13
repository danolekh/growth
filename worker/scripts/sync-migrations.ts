#!/usr/bin/env bun
/**
 * drizzle-kit 1.0 writes one folder per migration (`drizzle/<stamp>_<name>/migration.sql`);
 * Alchemy's D1 resource wants flat, numerically prefixed `.sql` files. This copies the former
 * into `migrations/NNNN_<name>.sql`, idempotently, preserving order by stamp.
 *
 *   bunx drizzle-kit generate && bun scripts/sync-migrations.ts
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const src = join(root, "drizzle");
const out = join(root, "migrations");
mkdirSync(out, { recursive: true });

const dirs = readdirSync(src, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

dirs.forEach((dir, i) => {
  const sqlPath = join(src, dir, "migration.sql");
  if (!existsSync(sqlPath)) return;
  const name = dir.replace(/^\d+_/, "");
  const target = join(out, `${String(i + 1).padStart(4, "0")}_${name}.sql`);
  const sql = readFileSync(sqlPath, "utf8");
  if (existsSync(target) && readFileSync(target, "utf8") === sql) return;
  writeFileSync(target, sql);
  console.log(`wrote ${target}`);
});
