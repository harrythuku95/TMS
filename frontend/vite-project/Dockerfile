# Build stage
FROM node:18 as build

WORKDIR /app

# Copy yarn.lock and package.json
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Serve stage
FROM node:18-slim

WORKDIR /app

# Install serve globally using yarn
RUN yarn global add serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

EXPOSE 5173

# Use serve to host the production build
CMD ["serve", "-s", "dist", "-l", "5173"]