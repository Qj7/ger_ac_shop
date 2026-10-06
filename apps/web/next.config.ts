import { resolve } from 'node:path';
import type { NextConfig } from 'next';

const apiUrl = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
const demo = process.env.NEXT_PUBLIC_DEMO === '1';

const nextConfig: NextConfig = {
  transpilePackages: ['@ic/shared'],
  poweredByHeader: false,
  ...(demo
    ? {
        // Static demo for GitHub Pages (see lib/demo): plain HTML files, no server, no API.
        output: 'export',
        basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        output: 'standalone',
        outputFileTracingRoot: resolve(process.cwd(), '../..'),
        // In production Caddy routes /api/* straight to the API. The rewrite makes local development
        // (without Caddy) and server-side image optimization work the same way.
        async rewrites() {
          return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
        },
      }),
};

export default nextConfig;
