# Build context: repository root (see docker-compose.yml)
FROM node:22-bookworm-slim AS base
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter "@ic/web..."

COPY packages/shared packages/shared
COPY apps/web apps/web

# Baked into the build: the /api rewrite target and absolute URLs in prerendered pages (sitemap, JSON-LD).
ARG API_INTERNAL_URL=http://api:4000
ARG PUBLIC_SITE_URL=http://localhost:3000
ENV API_INTERNAL_URL=$API_INTERNAL_URL \
  PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
  NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @ic/shared build && pnpm --filter @ic/web build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  HOSTNAME=0.0.0.0 \
  PORT=3000
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=node:node /app/apps/web/public ./apps/web/public
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
