FROM node:20

WORKDIR /app

COPY package.json .

RUN yarn
RUN npm install --os=linux --cpu=x64 sharp

COPY . ./

RUN yarn db:generate
RUN yarn build

EXPOSE 4000

CMD yarn start