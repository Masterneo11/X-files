
# Use Node.js for building and serving
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist /app
EXPOSE 80
CMD ["npx", "serve", "-s", "/app"]

# # us the official nod.sjs image
# From node:20-alpine

# #set the working directory inside the container
# WORKDIR /app

# COPY package*.json ./

# # install dependencies
# RUN npm install

# COPY . .


# EXPOSE 5173

# CMD ["npm", "run", "dev"]

