resource "aws_s3_bucket" "finance" {
    bucket = "finance-20201226"
    tags = {
        Description = "Finance and Payroll"
    }
}

