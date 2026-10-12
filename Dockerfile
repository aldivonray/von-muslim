ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
COPY . .
# Throwaway values so `next build` can read env while collecting page data.
# They live only in this RUN and are never used at runtime.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build \
    BETTER_AUTH_SECRET=build-only-placeholder-not-a-real-secret \
    npm run build

# Runs the committed SQL migrations once per release, then exits.
FROM node:${NODE_VERSION}-alpine AS migrator
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY scripts ./scripts
COPY drizzle ./drizzle
USER node
CMD ["node", "scripts/migrate.mjs"]

# Default target: the minimal standalone server.
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/icon.svg || exit 1
CMD ["node", "server.js"]
