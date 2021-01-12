variable "prefix" {
  default = "ecom"
}

variable "project" {
  default = "ecommerce-app"
}

variable "contact" {
  default = "admin@iotcloudsolutions.com"
}

variable "ecr_image_app" {
  description = "ECR image for Ecommerce-app"
  default     = "677092314568.dkr.ecr.us-east-2.amazonaws.com/ecommerce-devops"
}

variable "db_username" {
  description = "Username for the MongoDB Atlas instance"
}

variable "db_password" {
  description = "Password for the MongoDB Atlas instance"
}

variable "db_name" {
  description = "Name of the database inside MongoDB Atlas"
}

variable "sendgrid_api_key" {
  description = "Api key of the E-mail service"
}
