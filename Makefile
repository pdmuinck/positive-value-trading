ecr-login:
	aws ecr get-login-password --region eu-west-1 --profile=default \
	| docker login --username AWS --password-stdin 704365934136.dkr.ecr.eu-west-1.amazonaws.com

deploy:ecr-login
	docker tag $(tag) 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:$(tag)
	docker push 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:$(tag)
