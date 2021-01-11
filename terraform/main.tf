provider "aws" {
  region  = "us-east-2"
  version = "~> 2.50.0"
}

terraform {
  backend "s3" {
    bucket         = "rick-ecommerce-devops-tfstate"
    key            = "ecommerce-app.tfstate"
    encrypt        = true
    region         = "us-east-2"
    dynamodb_table = "ecommerce-devops-tf-state-lock"
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Enviroment = terraform.workspace
    Project    = var.project
    Owner      = var.contact
    ManageBy   = "Terraform"
  }
}

data "aws_region" "current" {}