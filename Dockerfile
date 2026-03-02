FROM node:24.13.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=development
ENV NEXT_PUBLIC_API_BASE_URL=http://host.docker.internal:5050
EXPOSE 3000

CMD ["npm", "run","dev"]
