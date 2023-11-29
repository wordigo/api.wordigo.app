FROM node:20

WORKDIR /app

COPY package.json .

RUN yarn

COPY . ./

RUN yarn db:generate
RUN yarn db:push
RUN yarn build

EXPOSE 4000

CMD yarn start