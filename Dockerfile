FROM node:16-alpine AS builder
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=@wordigo/api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:16-alpine AS installer
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/packages/db/prisma ./prisma
COPY .env .env
RUN npm install --frozen-lockfile
RUN npx prisma generate

FROM node:16-alpine AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
RUN npm run build

FROM node:16-alpine as runner
WORKDIR /app
EXPOSE 4000
COPY --from=sourcer /app/ .
COPY .env .env
CMD npm run start