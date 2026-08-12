/**
 * Serves the exported `out/` directory the way GitHub Pages does — mounted
 * under the site's base path, so asset URLs resolve exactly as they will in
 * production. A plain static server rooted at `out/` would 404 on every
 * `/publicsociety/_next/...` request and hide real path bugs.
 *
 *   npm run preview
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve, sep } from "node:path";

const basePath = process.env.BASE_PATH ?? "/publicsociety";
const port = Number(process.env.PORT ?? 3000);
const root = resolve("out");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(pathname) {
  // Directory URLs (and the bare base path) serve index.html, matching
  // trailingSlash: true output.
  const candidates = pathname.endsWith("/")
    ? [join(root, pathname, "index.html")]
    : [join(root, pathname), join(root, `${pathname}.html`), join(root, pathname, "index.html")];

  for (const candidate of candidates) {
    // Refuse anything that escapes out/ via ../ traversal.
    if (candidate !== root && !candidate.startsWith(root + sep)) continue;
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");

  if (basePath && !pathname.startsWith(basePath)) {
    res.writeHead(302, { Location: `${basePath}/` });
    res.end();
    return;
  }

  const file = await resolveFile(pathname.slice(basePath.length) || "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end(`404 — no file for ${pathname}`);
    return;
  }

  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
});

server.listen(port, () => {
  console.log(`Previewing out/ at http://localhost:${port}${basePath}/`);
});
