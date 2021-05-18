FROM public.ecr.aws/lambda/nodejs:latest
WORKDIR /var/task
COPY /valuebet-finder ./
COPY /books ./books
COPY /utils ./utils
COPY package*.json ./
RUN npm install
CMD ["betoffer.handler"]
