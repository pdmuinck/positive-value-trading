resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "event_mapper_lambda" {
  function_name = "event-mapper"
  role          = aws_iam_role.iam_for_lambda.arn
  image_uri     = "704365934136.dkr.ecr.eu-west-1.amazonaws.com/scrapers/prod/event-mapper:${var.image_tag}"
  package_type                   = "Image"
  tags = {
    Squad = "Scrapers"
    Application = "event-mapper"
    Stage = "prod"
  }
  memory_size = 128
  timeout = 10
}