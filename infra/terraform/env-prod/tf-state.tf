terraform {
  backend "s3" {
    bucket         = "pdemuinck-terraform-backend-store"
    encrypt        = "true"
    key            = "terraform.tfstate"
  }
  required_version = ">= 0.14"
}