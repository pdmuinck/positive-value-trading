FROM gcr.io/google.com/cloudsdktool/cloud-sdk:alpine
RUN apk --update add openjdk7-jre jq nodejs-current

ENV PORT 8080

COPY . .

CMD [ "node", "server.js" ]