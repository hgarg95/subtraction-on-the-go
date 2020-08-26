FROM node:latest
MAINTAINER garghimanshu0204@gmail.com
WORKDIR /subtraction-on-the-go

COPY . /subtraction-on-the-go

RUN npm install

RUN npm install -g newman

RUN ["chmod", "+x", "deployment.sh"]

ENTRYPOINT ["./deployment.sh"]