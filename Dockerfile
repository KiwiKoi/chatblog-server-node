FROM node:16
LABEL authors="daniel"
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
#
#RUN apk add python3 make g++\
#    && echo 'alias python="/usr/share/gcc-8/python3"' >> /etc/bash.bashrc \
#    && source /etc/bash.bashrc\
#    && npm config set python=python3\
#    && rm -rf /var/cache/apk/*

RUN npm install
RUN npm install prisma
RUN npx prisma generate

COPY . .

EXPOSE 8080
CMD ["npm", "run", "dev"]