FROM alpine
RUN apk --update add jq nodejs-current miller bash curl

ENV PORT 8080

COPY . .
RUN chmod 777 find_value_bets

CMD [ "node", "server.js" ]