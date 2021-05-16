resource "aws_s3_bucket" "sport_events" {
  bucket = "pdemuinck-sport-events"
  acl    = "private"

  tags = {
    Squad = "Scrapers"
    Environment = "prod"
  }
}