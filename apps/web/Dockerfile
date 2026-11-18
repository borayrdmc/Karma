FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install dependencies (leverages layer caching)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy pruned source files
COPY --from=builder /app/out/full/ .

# Build arguments needed for static Next.js compilation
ARG DATABASE_URL="postgresql://postgres:postgrespassword@postgres:5432/karma_db"
ARG BETTER_AUTH_SECRET="build-dummy-better-auth-secret-key-32-chars-long"
ARG BETTER_AUTH_URL="http://localhost:3000"
ARG NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
ARG INTERNAL_API_KEY="build-dummy-internal-api-key"
ARG SERVICES_URL="http://services:3001"

ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV NEXT_PUBLIC_BETTER_AUTH_URL=$NEXT_PUBLIC_BETTER_AUTH_URL
ENV INTERNAL_API_KEY=$INTERNAL_API_KEY
ENV SERVICES_URL=$SERVICES_URL

RUN pnpm turbo run build --filter=web...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/public ./apps/web/public

# Standalone output bundle and static files
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
