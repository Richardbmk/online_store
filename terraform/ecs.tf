resource "aws_ecs_cluster" "main" {
  name = "${local.prefix}-cluster"

  tags = local.common_tags
}

resource "aws_iam_policy" "task_execution_role_policy" {
  name        = "${local.prefix}-task-exec-role-policy"
  path        = "/"
  description = "Allow retrieving images and adding to logs"
  policy      = file("./templates/ecs/task-exec-role.json")
}

resource "aws_iam_role" "task_execution_role" {
  name               = "${local.prefix}-task-exec-role"
  assume_role_policy = file("./templates/ecs/assume-role-policy.json")

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "task_execution_role" {
  role       = aws_iam_role.task_execution_role.name
  policy_arn = aws_iam_policy.task_execution_role_policy.arn
}

resource "aws_iam_role" "app_iam_role" {
  name               = "${local.prefix}-app-task"
  assume_role_policy = file("./templates/ecs/assume-role-policy.json")

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "ecs_task_logs" {
  name = "${local.prefix}-app"

  tags = local.common_tags
}

data "template_file" "app_container_definitions" {
  template = file("./templates/ecs/container-definitions.json.tpl")

  vars = {
    db_name          = var.db_name
    db_username      = var.db_username
    db_password      = var.db_password
    app_image        = var.ecr_image_app
    sendgrid_api_key = var.sendgrid_api_key
    log_group_name   = aws_cloudwatch_log_group.ecs_task_logs.name
    log_group_region = data.aws_region.current.name
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${local.prefix}-app"
  container_definitions    = data.template_file.app_container_definitions.rendered
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.task_execution_role.arn
  task_role_arn            = aws_iam_role.app_iam_role.arn

  tags = local.common_tags
}

resource "aws_security_group" "ecs_service" {
  description = "Access for the ECS Service"
  name        = "${local.prefix}-ecs-service"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_ecs_service" "app" {
  name            = "${local.prefix}-app"
  cluster         = aws_ecs_cluster.main.name
  task_definition = aws_ecs_task_definition.app.family
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = true
    subnets = [
      aws_subnet.public_a.id,
      aws_subnet.public_b.id
    ]
    security_groups = [aws_security_group.ecs_service.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "ecommerce-app"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.app]
}