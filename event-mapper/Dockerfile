FROM node
WORKDIR /usr/src/app
COPY /books ./books
COPY /utils ./utils
COPY /event-mapper ./event-mapper
COPY package*.json ./
RUN npm install
CMD [ "node", "event-mapper/scheduler.js" ]
