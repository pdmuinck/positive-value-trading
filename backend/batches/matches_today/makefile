build:
	docker build . -t pjtest \
	&& docker tag pjtest europe-west1-docker.pkg.dev/trusty-cacao-327717/valuebets/matches_of_the_day:test \
	&& docker push europe-west1-docker.pkg.dev/trusty-cacao-327717/valuebets/matches_of_the_day:test


schedule:
	gcloud scheduler jobs create http my-hourly-job \
	  --description "Call my function hourly" \
	  --schedule "0 * * * *" \
	  --time-zone "Europe/Berlin" \
	  --uri "https://matches-of-the-day-sah63l2xba-ew.a.run.app" \
	  --http-method GET \
	  --oidc-service-account-email invoker-matches-of-the-day@trusty-cacao-327717.iam.gserviceaccount.com