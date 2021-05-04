resource "aws_ecr_repository" "event_mapper_test" {
  tags = {
    Squad       = "scrapers",
    Stage = "test"
    Application = "valuebet-service"
  }
  image_scanning_configuration {
    scan_on_push = true
  }
  name = "scrapers/test/event-mapper"
}

resource "aws_ecr_repository" "valuebet_finder_test" {
  tags = {
    Squad       = "scrapers",
    Stage = "test"
    Application = "valuebet-service"
  }
  image_scanning_configuration {
    scan_on_push = true
  }
  name = "scrapers/test/valuebet-finder"
}