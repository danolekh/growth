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
const filled = src.replaceAll("{{WORKER_URL}}", workerUrl()).replaceAll("{{ROUTINE_TOKEN}}", need("ROUTINE_TOKEN"));

/**
 * The source is wrapped at ~95 columns for reading. The routine gets one line per paragraph or
 * list item: fenced code keeps its lines (backslash continuations joined), everything else joins
 * onto the previous line unless it starts a list item, a numbered step, a heading, or one of the
 * rule paragraphs that begin with a capitalized label.
 */
const STARTS_OWN_LINE = /^(\s*)([-*•]\s|\d+\.\s|#|```|Voice:|Discord posts|The JSON|For each|Rules:|Setup:|Fetch the queue|It returns)/;
export const unwrapPrompt = (text: string): string => {
  const out: string[] = [];
  let fenced = false;
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (line.trim().startsWith("```")) {
      fenced = !fenced;
      out.push(line.trim());
      continue;
    }
    if (fenced) {
      const prev = out[out.length - 1];
      if (prev?.endsWith("\\")) out[out.length - 1] = `${prev.slice(0, -1).trimEnd()} ${line.trim()}`;
      else out.push(line);
      continue;
    }
    const prev = out[out.length - 1];
    if (line.trim() === "" || prev === undefined || prev === "" || prev.startsWith("```") || STARTS_OWN_LINE.test(line)) {
      out.push(line.trim() === "" ? "" : line.replace(/^\s{2,}/, (m) => m.slice(0, 3)));
      continue;
    }
    out[out.length - 1] = `${prev} ${line.trim()}`;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
};

const [head, prompt] = filled.split(/^## Prompt\s*$/m);
const out = prompt ? `${head}## Prompt\n\n${unwrapPrompt(prompt)}\n` : filled;
const target = join(root, "routines", "draft-applications.local.md");
writeFileSync(target, out);
console.log(`wrote ${target} (contains the routine token; it is gitignored)`);
