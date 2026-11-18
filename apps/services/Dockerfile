FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune services --docker

FROM base AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=services...

# Production runner with Linux dependencies for Patchright/Chromium
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install Chromium system dependencies for headless scraping
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    && rm -rf /var/lib/apt/lists/*

# Copy built application and pruned dependencies
COPY --from=installer /app/out/json/ .
COPY --from=installer /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=installer /app/apps/services/dist ./apps/services/dist
COPY --from=installer /app/apps/services/package.json ./apps/services/package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/services/node_modules ./apps/services/node_modules

# Install Patchright Chromium browser into shared directory
ENV PATCHRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx --prefix apps/services patchright install chromium

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

EXPOSE 3001

CMD ["node", "apps/services/dist/index.js"]
