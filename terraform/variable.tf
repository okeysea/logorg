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

variable "env_vars" {
  type = map

  default = {}
}
