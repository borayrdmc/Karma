FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1) Monorepo'dan sadece services ve bağımlı paketleri ayıkla
FROM base AS builder
WORKDIR /app
COPY . .
RUN npx --yes turbo@2.10.7 prune services --docker

# 2) Bağımlılıkları kur ve derle
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
# "build" script'i Chromium'u da indirdiği için burada sadece tsup çalıştırılır;
# Chromium, runner aşamasında sistem bağımlılıklarıyla birlikte kurulur.
RUN pnpm --filter services exec tsup

# 3) Çalışma ortamı: Node 22 + Patchright Chromium ve Linux bağımlılıkları
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY --from=installer /app /app
RUN pnpm --filter services exec patchright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/*

ENV PORT=3001
ENV HOST=0.0.0.0
EXPOSE 3001

CMD ["node", "apps/services/dist/index.js"]
