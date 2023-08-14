#FROM node:16-alpine3.14
FROM node:14-alpine3.15

COPY . /blog

WORKDIR /blog

RUN apk update
RUN apk add python3 alpine-sdk autoconf automake nasm libtool vips-dev

RUN npm install
RUN npm audit fix
EXPOSE 8000
CMD npm start
