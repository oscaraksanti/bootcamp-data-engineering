import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @electric-sql/pglite ships an Emscripten-generated WASM/JS pair that
  // must reach the browser untransformed — bundling/minifying it breaks
  // its internal instantiateWasm hook in production builds.
  transpilePackages: ["@electric-sql/pglite"],
};

export default nextConfig;
