FROM node:14

WORKDIR /app

COPY vite-project/package*.json ./

RUN npm install

COPY vite-project/ .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]