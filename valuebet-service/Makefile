clean:
	rm -r node_modules

pre-build:clean
	npm install

build:pre-build
	docker build . -t $(tag) --no-cache

ecr-login:
	aws ecr get-login-password --region eu-west-1 --profile=default | docker login --username AWS --password-stdin 704365934136.dkr.ecr.eu-west-1.amazonaws.com

deploy:ecr-login
	docker tag $(tag) 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:$(tag)
	docker push 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:$(tag)
