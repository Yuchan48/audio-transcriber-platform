FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_SENTRY_DSN
ARG VITE_POSTHOG_PROJECT_TOKEN
ARG VITE_POSTHOG_HOST

ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ENV VITE_POSTHOG_PROJECT_TOKEN=$VITE_POSTHOG_PROJECT_TOKEN
ENV VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST

RUN npm run build

# production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
