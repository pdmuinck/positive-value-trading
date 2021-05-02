terraform {
  backend "s3" {
    bucket         = "terraform-state-non-prod"
    region         = "eu-west-1"
    encrypt        = "true"
    key            = "valuebet-service-test-eu-west-1.tfstate"
    dynamodb_table = "terraform-statelock"
  }
  required_version = ">= 0.14"
}