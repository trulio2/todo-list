FROM node:18.16.0

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /api

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["sh", "-c", "dockerize -wait tcp://mongodb:27017 -timeout 120s && yarn start:prod"]
