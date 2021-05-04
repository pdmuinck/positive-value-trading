ecr-login:
	aws ecr get-login-password --region eu-west-1 --profile=default | docker login --username AWS --password-stdin 704365934136.dkr.ecr.eu-west-1.amazonaws.com

publish-event-mapper:ecr-login
	cd src/event-mapper
	docker build . --tag $(tag)
	docker tag $(tag) 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/test/event-mapper:$(tag)
	docker push 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/test/event-mapper:$(tag)

promote-event-mapper:ecr-login
	docker pull 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/test/event-mapper:$(tag)
	docker tag 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/test/event-mapper:$(tag) 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:$(tag)
	docker push 704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:$(tag)


