#!/usr/bin/env bun
/**
 * Fills routines/draft-applications.md with the Worker URL and routine token and writes the
 * result to routines/draft-applications.local.md (gitignored). Paste that file's Prompt section
 * into the Claude Code `schedule` skill when creating the routine.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { loadEnv, need, workerUrl } from "./env.ts";

loadEnv();
const root = join(import.meta.dir, "..");
const src = readFileSync(join(root, "routines", "draft-applications.md"), "utf8");
const out = src.replaceAll("{{WORKER_URL}}", workerUrl()).replaceAll("{{ROUTINE_TOKEN}}", need("ROUTINE_TOKEN"));
const target = join(root, "routines", "draft-applications.local.md");
writeFileSync(target, out);
console.log(`wrote ${target} (contains the routine token; it is gitignored)`);
