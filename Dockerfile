FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

ARG NEXT_PUBLIC_TREE_GROWTH_MAX_KM=10000
ENV NEXT_PUBLIC_TREE_GROWTH_MAX_KM=$NEXT_PUBLIC_TREE_GROWTH_MAX_KM

COPY . .
RUN pnpm build

FROM dependencies AS migrator

CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]

FROM node:24-alpine AS production

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
