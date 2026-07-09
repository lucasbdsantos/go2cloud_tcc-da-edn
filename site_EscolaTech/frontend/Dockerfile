FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# NEXT_PUBLIC_* vars are inlined into the client JS bundle at build time, not
# read at runtime. Must be passed as --build-arg, not just a runtime ENV on
# the final stage, or the deployed app will silently point at localhost.
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
