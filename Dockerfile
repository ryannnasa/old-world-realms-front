# Stage 1: Build de l'application Vue.js
FROM node:25-alpine AS build

# Copie des fichiers de dépendances
COPY package.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de production
RUN npm run build

FROM nginx
COPY --from=build dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d