FROM node:18

WORKDIR /app

COPY package.json .

RUN yarn

COPY . ./

EXPOSE 4000

CMD sh -c "yarn db:generate && yarn db:push && yarn dev"
