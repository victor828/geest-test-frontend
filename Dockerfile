# syntax=docker/dockerfile:1

##########################
# Base: dependencias comunes
##########################
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack prepare pnpm@9.0.0 --activate && pnpm install --frozen-lockfile

##########################
# Dev: servidor Vite con hot-reload
##########################
FROM base AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]

##########################
# Build: compila el bundle de producción
##########################
FROM base AS build
WORKDIR /app
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN pnpm run build

##########################
# Prod: nginx sirviendo el build estático
##########################
FROM nginx:1.27-alpine AS prod
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
