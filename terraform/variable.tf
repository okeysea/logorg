terraform {

  required_version = "= 0.14.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket = "logorg-tfstate"
    key    = "ecr/terraform.tfstate"
  }
}

provider "aws" {}

provider "aws" {
  alias  = "verginia"
  region = "us-east-1"
}

variable "env_vars" {
  type = map(any)

  default = {}
}
