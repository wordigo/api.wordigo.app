FROM node:18

WORKDIR /app

COPY package.json .

RUN yarn

COPY . ./

RUN yarn db:generate
RUN yarn db:push
RUN yarn build

EXPOSE 8080

CMD yarn start