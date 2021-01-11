variable "prefix" {
  default = "str"
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