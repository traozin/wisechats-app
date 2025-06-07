FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
