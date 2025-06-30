

FROM node:23-slim AS base
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
# COPY .env.production /app/.env.production
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN rm -f /app/.env.production
RUN rm -f /app/.env.development

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build
RUN rm -f /app/.env.production
RUN rm -f /app/.env.development

FROM base as runner
RUN rm -f /app/.env.production
RUN rm -f /app/.env.development
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/public /app/public
COPY --from=build /app/.next /app/.next
COPY --from=build /app/package.json /app/package.json
EXPOSE 3000
ENV PORT 3000
CMD [ "pnpm", "start" ]