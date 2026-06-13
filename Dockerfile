FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run lint
RUN npm test

FROM nginx:alpine AS production

COPY --from=build /app/index.html /usr/share/nginx/html/
COPY --from=build /app/assets /usr/share/nginx/assets

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
