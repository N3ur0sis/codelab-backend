FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json prisma ./

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 4000

CMD ["npm", "run", "start"]
