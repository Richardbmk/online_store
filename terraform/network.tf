resource "aws_default_vpc" "default" {

  tags = merge(
    local.common_tags,
    map("Name", "${local.prefix}-vpc")
  )
}

resource "aws_default_subnet" "default_az1" {
  availability_zone = "${data.aws_region.current.name}a"

  tags = merge(
    local.common_tags,
    map("Name", "${local.prefix}-public-a")
  )
}