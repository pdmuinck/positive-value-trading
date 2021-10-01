FROM gcr.io/google.com/cloudsdktool/cloud-sdk:alpine
RUN apk --update add openjdk7-jre jq

COPY . .
EXPOSE 8080
ENTRYPOINT [ "/matches_of_the_day" ]