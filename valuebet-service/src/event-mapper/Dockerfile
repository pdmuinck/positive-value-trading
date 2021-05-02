FROM node:16
COPY ../../. /app
RUN npm install --save-dev typescript
RUN npm run build


# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]
