FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN corepack enable

# 1) Monorepo'dan sadece services ve bağımlı paketleri ayıkla
FROM base AS builder
WORKDIR /app
COPY . .
RUN npx --yes turbo@2.10.7 prune services --docker

# 2) Bağımlılıkları ve Chromium'u kaynak koddan ÖNCE kur (kod değişikliklerinde cache korunur)
FROM base AS deps
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter services exec patchright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/*

# 3) Kaynak kodu kopyala ve derle (yukarıdaki Chromium katmanı yeniden indirmez)
FROM deps AS runner
WORKDIR /app
COPY --from=builder /app/out/full/ .
RUN pnpm --filter services exec tsup

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
EXPOSE 3001

CMD ["node", "apps/services/dist/index.js"]
