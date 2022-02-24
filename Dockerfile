FROM node:14.17.0-alpine

MAINTAINER João Harbs <harbspj@gmail.com>

RUN apk --no-cache add curl

WORKDIR /usr/app

COPY package.json .

RUN npm install --quiet

COPY . .
