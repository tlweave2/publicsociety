/**
 * GitHub Pages is a static file host, so the site is exported as plain
 * HTML/CSS/JS rather than run by a Next server.
 *
 * This is a *project* page (repo `publicsociety`, not `tlweave2.github.io`),
 * so it is served from a subdirectory: https://tlweave2.github.io/publicsociety/
 * Every asset URL therefore needs the `/publicsociety` prefix.
 *
 * Using a custom domain instead? The site then lives at the domain root —
 * build with an empty base path: `BASE_PATH= npm run build`
 */
const basePath = process.env.BASE_PATH ?? "/publicsociety";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  // Emit `about/index.html` rather than `about.html`, which is what a static
  // host needs to resolve a directory URL. Harmless for the single route today.
  trailingSlash: true,
  images: {
    // The Image Optimization API needs a server. Required if the photo frames
    // in Article I ever switch to next/image.
    unoptimized: true,
  },
};

export default nextConfig;
