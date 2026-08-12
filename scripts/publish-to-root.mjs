/**
 * Copies the static export from out/ into the repository root.
 *
 * GitHub Pages for this repo is configured as "Deploy from a branch" pointing
 * at main, which serves the branch's files exactly as they are. A Next project
 * has no index.html in source — it only exists after a build — so the built
 * site has to live at the repo root for that mode to work.
 *
 *   npm run publish   (runs the build first)
 *
 * Then commit the changed files alongside your source change.
 *
 * The alternative is switching Pages' Source to "GitHub Actions", which serves
 * the build artifact directly and makes all of this unnecessary.
 */
import { readdirSync, statSync, rmSync, cpSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = join(root, "out");

// Never let generated output clobber source, no matter what lands in out/.
const PROTECTED = new Set([
  ".git", ".github", ".gitignore", "app", "public", "docs", "scripts",
  "assets-source", "node_modules", "package.json", "package-lock.json",
  "next.config.mjs", "jsconfig.json", "README.md",
]);

if (!existsSync(out)) {
  console.error("out/ does not exist — run `npm run build` first.");
  process.exit(1);
}

const entries = readdirSync(out);
const clobber = entries.filter((e) => PROTECTED.has(e));
if (clobber.length) {
  console.error(`Refusing to publish: out/ contains protected name(s): ${clobber.join(", ")}`);
  process.exit(1);
}

// Replace the previous copy rather than merging into it, so files deleted in a
// rebuild don't linger at the root.
for (const entry of entries) {
  const dest = join(root, entry);
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
}

for (const entry of entries) {
  cpSync(join(out, entry), join(root, entry), { recursive: true });
}

// Without this, Pages runs Jekyll over the root and strips _next/ — every
// script and stylesheet 404s and the page renders unstyled.
writeFileSync(join(root, ".nojekyll"), "");

const published = entries
  .map((e) => (statSync(join(out, e)).isDirectory() ? `${e}/` : e))
  .sort();
console.log(`Published ${published.length} entries to the repo root:`);
console.log("  " + published.join("  "));
console.log("\nCommit these alongside your source change.");
