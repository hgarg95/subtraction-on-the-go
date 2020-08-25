FROM node:latest
MAINTAINER garghimanshu0204@gmail.com
WORKDIR /subtraction-on-the-go

COPY . /subtraction-on-the-go

RUN npm install

ENTRYPOINT ["npm", "start"]