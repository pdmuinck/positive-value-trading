resource "aws_ecr_repository" "event_mapper" {
  tags = {
    Squad       = "scrapers",
    Stage = "prod"
    Application = "valuebet-service"
  }
  image_scanning_configuration {
    scan_on_push = true
  }
  name = "scrapers/prod/event-mapper"
}

resource "aws_ecr_repository" "valuebet_finder" {
  tags = {
    Squad       = "scrapers",
    Stage = "prod"
    Application = "valuebet-service"
  }
  image_scanning_configuration {
    scan_on_push = true
  }
  name = "scrapers/prod/valuebet-finder"
}