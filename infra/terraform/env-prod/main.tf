locals {
  repositories = toset([
    "scrapers/prod/event-mapper"
  ])
}

resource "aws_ecr_repository" "event_mapper_prod" {
  tags = {
    Squad       = "Scrapers",
    Stage = "prod"
    Application = "event-mapper"
  }
  image_scanning_configuration {
    scan_on_push = true
  }
  name = "scrapers/prod/event-mapper"
}

resource "aws_ecr_lifecycle_policy" "policy" {
  depends_on = [aws_ecr_repository.event_mapper_prod]
  for_each   = local.repositories
  repository = each.value
  policy     = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images older than 14 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 14
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}