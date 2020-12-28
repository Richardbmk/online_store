terraform {
    backend "s3" {
        bucket = "ecommerce-terraforms"
        key = "terraformstate/terraform.tfstate"
        region = "us-east-2"
        dynamodb_table = "ecommerce-statelock-terraform"
    }
}