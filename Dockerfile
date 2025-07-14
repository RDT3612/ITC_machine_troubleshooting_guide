# Multi-stage build
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./

FROM node:18-alpine
WORKDIR /app
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/build ./frontend/build
WORKDIR /app/backend
EXPOSE 5000
CMD ["npm", "start"]
