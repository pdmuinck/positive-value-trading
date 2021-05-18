FROM public.ecr.aws/lambda/nodejs:latest
WORKDIR /var/task
COPY . .
RUN npm install
CMD ["betoffer.handler"]
