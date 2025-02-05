ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}

ENV NODE_ENV production

WORKDIR /home/kacperk/Dokumenty/WebServicesZaliczenie/

USER node

COPY . .

EXPOSE 3000

CMD node express.js
