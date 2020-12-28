PROJECT_ID=ecommerce
AWS_REGION=us-east-2
ENV=staging


run-local:
	docker-compose up

create-tf-backend-bucket:
	aws s3 mb s3://$(PROJECT_ID)-terraforms --region $(AWS_REGION)

aws-bucket-versioning:
	aws s3api put-bucket-versioning --bucket $(PROJECT_ID)-terraforms --versioning-configuration Status=Enabled

aws-bucket-encryption:

	aws s3api put-bucket-encryption \
		--bucket $(PROJECT_ID)-terraforms \
		--server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

create-tf-backend-bucket-folder:
	aws s3api put-object --bucket $(PROJECT_ID)-terraforms --key terraformstate/ --region $(AWS_REGION)

create-tf-backend-dynamodb_tb:
	aws dynamodb create-table --table-name $(PROJECT_ID)-statelock-terraform \
	 --attribute-definitions AttributeName=LockID,AttributeType=S \
	  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
	   --key-schema AttributeName=LockID,KeyType=HASH --region us-east-2 


terraform-create-workspace:
	cd terraform && \
	 terraform workspace new $(ENV)

terraform-init:
	cd terraform && \
	 terraform workspace select $(ENV) && terraform init
