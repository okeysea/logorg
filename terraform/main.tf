locals {
  name = "logorg"
  region = "us-east-2"
}
###############################################
# NETWORK
###############################################
module "network" {
  source = "./modules/network"

  vpc_cidr_block = "10.0.0.0/16"
  vpc_enable_dns_hostnames = true
  vpc_enable_dns_support   = true

  subnets = {
    public-1a = {
      cidr = "10.0.1.0/24"
      zone = "us-east-2a"
      name = "public-subnet"
      type = "public"
    }

    public_1c = {
      cidr = "10.0.2.0/24"
      zone = "us-east-2b"
      name = "public-subnet"
      type = "public"
    }

    private-1a = {
      cidr = "10.0.10.0/24"
      zone = "us-east-2a"
      name = "private-subnet"
      type = "private"
    }

    private-1c = {
      cidr = "10.0.20.0/24"
      zone = "us-east-2b"
      name = "private-subnet"
      type = "private"
    }
  }

  subnet_groups = {
    db-group = {
      type        = "DB"
      subnet_keys = ["private-1a", "private-1c"]
      name        = "private-db"
    }

    public-group = {
      type        = "public"
      subnet_keys = ["public-1a"]
      name        = "public-db"
    }
  }

  security_groups = {

    sg-web = {
      name          = "web-security_group"
      ingress_rules = ["http", "https"]
      egress_rules  = ["all"]
    }

    sg-mailrelay = {
      name          = "mailrelay-security_group"
      ingress_rules  = ["mailrelay"]
      egress_rules  = ["all"]
    }

    sg-db = {
      name          = "db-security_group"
      ingress_rules = ["db"]
      egress_rules  = ["all"]
    }

    sg-endpoint = {
      name          = "endpoint-security_group"
      ingress_rules = ["endpoint"]
      egress_rules  = ["endpoint"]
    }
  }

  security_group_rules = [ 
    { name = "db", from_to = "3306-3306-tcp",     cidrs = { cidr_blocks = ["0.0.0.0/0"]} },
    { name = "https", from_to = "443-443-tcp",    cidrs = { cidr_blocks = ["0.0.0.0/0"]} },
    { name = "mailrelay", from_to="25-25-tcp",    cidrs = { cidr_blocks = [module.network.vpc.cidr_block]} },
    { name = "endpoint", from_to = "443-443-tcp", cidrs = { cidr_blocks = [module.network.vpc.cidr_block]} },
  ]
}

###############################################
# Load Balancer
###############################################

resource "aws_lb" "main" {
  load_balancer_type = "application"
  name               = local.name
  security_groups    = [module.network.security_group["sg-web"].id ]
  subnets            = module.network.public_subnet.id_all
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  certificate_arn = aws_acm_certificate.main.arn

  port = "443"
  protocol = "HTTPS"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.this.id
  }
}

resource "aws_lb_listener" "main" {
  port               = "80"
  protocol           = "HTTP"

  load_balancer_arn  = aws_lb.main.arn
  

  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      status_code = "200"
      message_body = "OK"
    }
  }
}

resource "aws_lb_target_group" "this" {
  name = local.name

  vpc_id = module.network.vpc_id

  port = 80
  target_type = "ip"
  protocol = "HTTP"

  health_check {
    port = 80
  }
}

resource "aws_lb_listener_rule" "http_to_https" {

  listener_arn = aws_lb_listener.main.arn

  priority = 99

  action {
    type = "redirect"

    redirect {
      port = "443"
      protocol = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
    host_header {
      values = ["www.logorg.work"]
    }
  }
}


###############################################
# RDS
###############################################
resource "aws_db_instance" "test-db" {
  identifier             = "test-db"
  allocated_storage      = 20
  storage_type           = "gp2"
  engine                 = "mysql"
  engine_version         = "8.0"
  instance_class         = "db.t2.micro"
  name                   = "testdb"
  username               = "root"
  password               = var.env_vars.MYSQL_ROOT_PASSWORD
  vpc_security_group_ids = [module.network.security_group["sg-db"].id]
  db_subnet_group_name   = module.network.subnet_group.db["db-group"].name
  skip_final_snapshot    = true
}

###############################################
# ECR
###############################################

# resource "aws_ecr_repository" "logorg-rails" {
#   name = "${local.name}-rails"
#   image_tag_mutability = "MUTABLE"
# 
#   image_scanning_configuration {
#     scan_on_push = true
#   }
# }
# 
# resource "aws_ecr_repository" "logorg-nginx" {
#   name = "${local.name}-nginx"
#   image_tag_mutability = "MUTABLE"
# 
#   image_scanning_configuration {
#     scan_on_push = true
#   }
# }

###############################################
# System manager Parameter store
###############################################

resource "aws_ssm_parameter" "this" {
  for_each = var.env_vars
  name = each.key
  type = "SecureString"
  value = each.value
}

resource "aws_ssm_parameter" "dbendpoint" {
  name = "MYSQL_HOST"
  type = "SecureString"
  value = split(":", aws_db_instance.test-db.endpoint)[0]
}

###############################################
# ecs
###############################################
# cloud watch #################
resource "aws_cloudwatch_log_group" "this" {
  name = "/${local.name}/ecs"
  retention_in_days = "7"
}

# iam #########################
resource "aws_iam_role" "task_execution" {
  name = "${local.name}-TaskExecution"

  assume_role_policy = <<EOL
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOL
}

resource "aws_iam_role_policy" "task_execution" {
  role = aws_iam_role.task_execution.id

  policy = <<EOL
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "ssm:GetParameters"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOL
}

resource "aws_iam_role_policy_attachment" "task_execution" {
  role = aws_iam_role.task_execution.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# cluster #####################
resource "aws_ecs_cluster" "this" {
  name = local.name
}

# task def ####################
# メールリレー用
resource "aws_ecs_task_definition" "logorg-mailrelay" {
  family = "${local.name}-mailrelay"

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"

  cpu = "256"
  memory = "512"

  task_role_arn = aws_iam_role.task_execution.arn
  execution_role_arn = aws_iam_role.task_execution.arn

  container_definitions = <<EOL
  [
    {
      "environment": [],
      "name": "logorg-mailrelay",
      "image": "${var.env_vars.LOGORG_MAILRELAY_IMAGE}",
      "cpu": 50,
      "memory": 300,
      "portMappings": [
        {
          "containerPort": 25,
          "hostPort": 25
        }
      ],
      "entryPoint": [
        "sh", "-c"
      ],
      "command": [
        "/run.sh"
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "exit 0"],
        "startPeriod": 15
      },
      "secrets": [
        {
          "name": "SMTP_SERVER",
          "valueFrom": "SMTP_SERVER"
        },
        {
          "name": "SMTP_PORT",
          "valueFrom": "SMTP_PORT"
        },
        {
          "name": "SMTP_USERNAME",
          "valueFrom": "SMTP_USERNAME"
        },
        {
          "name": "SMTP_PASSWORD",
          "valueFrom": "SMTP_PASSWORD"
        },
        {
          "name": "SERVER_HOSTNAME",
          "valueFrom": "SERVER_HOSTNAME"
        },
        {
          "name": "SMTP_NETWORKS",
          "valueFrom": "SMTP_NETWORKS"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.this.name}",
          "awslogs-region": "${local.region}",
          "awslogs-stream-prefix": "[MAILRELAY]"
        }
      }
    }
  ]
EOL
}

# メールリレー用のECS Service
# パブリックサブネットに配置
resource "aws_ecs_service" "logorg-mailrelay" {
  name = "${local.name}-mailrelay"

  launch_type = "FARGATE"

  desired_count = 1

  cluster = aws_ecs_cluster.this.name

  task_definition = aws_ecs_task_definition.logorg-mailrelay.arn

  network_configuration {
    subnets = module.network.public_subnet.id_all
    security_groups = [module.network.security_group_id["sg-mailrelay"]]
    assign_public_ip = true
  }

  service_registries {
    registry_arn = aws_service_discovery_service.mailrelay.arn
  }

}

# メールリレー用のサービスディスカバリ
resource "aws_service_discovery_private_dns_namespace" "internal_mailrelay" {
  name = "internal.logorg"
  description = "mailrelay for logorg"
  vpc = module.network.vpc_id
}

resource "aws_service_discovery_service" "mailrelay" {
  name = "mailrelay"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.internal_mailrelay.id

    dns_records {
      ttl = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# データベースのユーザー作成したりするやつ
resource "aws_ecs_task_definition" "logorg-initdb" {
  family = "${local.name}-initdb"

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"

  cpu = "256"
  memory = "512"

  task_role_arn = aws_iam_role.task_execution.arn
  execution_role_arn = aws_iam_role.task_execution.arn

  container_definitions = <<EOL
  [
    {
      "environment": [],
      "name": "logorg-dbinit",
      "image": "${var.env_vars.LOGORG_DBINIT_IMAGE}",
      "cpu": 10,
      "memory": 24,
      "healthCheck": {
        "command": ["CMD-SHELL", "ash /health_check/user_exist.sh", "|| exit 1"],
        "startPeriod": 15
      },
      "secrets": [
        {
          "name": "MYSQL_HOST",
          "valueFrom": "MYSQL_HOST"
        },
        {
          "name": "MYSQL_ROOT_PASSWORD",
          "valueFrom": "MYSQL_ROOT_PASSWORD"
        },
        {
          "name": "MYSQL_USER",
          "valueFrom": "MYSQL_USER"
        },
        {
          "name": "MYSQL_PASSWORD",
          "valueFrom": "MYSQL_PASSWORD"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.this.name}",
          "awslogs-region": "${local.region}",
          "awslogs-stream-prefix": "[DBINIT]"
        }
      }
    }
  ]
EOL
}

resource "aws_ecs_task_definition" "logorg" {
  family = local.name

  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"

  # volume {
  #   name = "data-public"
  # }

  # volume {
  #   name = "data-tmp"
  # }

  cpu = "256"
  memory = "1024"

  task_role_arn = aws_iam_role.task_execution.arn
  execution_role_arn = aws_iam_role.task_execution.arn

  container_definitions = <<EOL
  [
    {
      "environment": [],
      "name": "logorg-rails",
      "image": "${var.env_vars.LOGORG_RAILS_IMAGE}",
      "cpu": 10,
      "memory": 500,
      "entryPoint": [
        "sh", "-c"
      ],
      "command": [
        "bundle exec pumactl start"
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "ruby /health_check/puma_started.rb", "|| exit 1"],
        "startPeriod": 30
      },
      "secrets": [
        {
          "name": "RAILS_ENV",
          "valueFrom": "RAILS_ENV"
        },
        {
          "name": "MYSQL_HOST",
          "valueFrom": "MYSQL_HOST"
        },
        {
          "name": "LOGORG_DATABASE_USERNAME",
          "valueFrom": "LOGORG_DATABASE_USERNAME"
        },
        {
          "name": "LOGORG_DATABASE_PASSWORD",
          "valueFrom": "LOGORG_DATABASE_PASSWORD"
        },
        {
          "name": "PROJECT_HOST_NAME",
          "valueFrom": "PROJECT_HOST_NAME"
        },
        {
          "name": "LOGORG_MAIL_SMTP_HOST",
          "valueFrom": "LOGORG_MAIL_SMTP_HOST"
        },
        {
          "name": "LOGORG_MAIL_SMTP_PORT",
          "valueFrom": "LOGORG_MAIL_SMTP_PORT"
        },
        {
          "name": "LOGORG_MAIL_DOMAIN",
          "valueFrom": "LOGORG_MAIL_DOMAIN"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.this.name}",
          "awslogs-region": "${local.region}",
          "awslogs-stream-prefix": "[RAILS]"
        }
      }
    },
    {
      "environment": [],
      "name": "logorg-nginx",
      "image": "${var.env_vars.LOGORG_NGINX_IMAGE}",
      "cpu": 10,
      "memory": 500,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ],
      "volumesFrom": [
        {
          "sourceContainer": "logorg-rails"
        }
      ],
      "entryPoint": [
        "sh", "-c"
      ],
      "command": [
        "/usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf"
      ],
      "dependsOn": [
        { "containerName": "logorg-rails", "condition": "HEALTHY" }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost/", "|| exit 1"],
        "startPeriod": 50
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "${aws_cloudwatch_log_group.this.name}",
          "awslogs-region": "${local.region}",
          "awslogs-stream-prefix": "[NGINX]"
        }
      }
    }
  ]
EOL
}

resource "aws_ecs_service" "this" {
  name = local.name

  launch_type = "FARGATE"

  desired_count = 1

  cluster = aws_ecs_cluster.this.name

  task_definition = aws_ecs_task_definition.logorg.arn

  network_configuration {
    subnets = module.network.private_subnet.id_all
    security_groups = [module.network.security_group_id["sg-web"]]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.this.arn
    container_name = "logorg-nginx"
    container_port = "80"
  }
}

# endpoints ###################

resource "aws_vpc_endpoint" "s3" {
  vpc_id = module.network.vpc_id
  service_name = "com.amazonaws.us-east-2.s3"
  vpc_endpoint_type = "Gateway"
}

resource "aws_vpc_endpoint_route_table_association" "private_s3" {
  for_each = module.network.private_subnet.key_all_map

  vpc_endpoint_id = aws_vpc_endpoint.s3.id
  route_table_id = module.network.private_route_table[each.key].id
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id = module.network.vpc_id
  service_name = "com.amazonaws.us-east-2.ecr.dkr"
  vpc_endpoint_type = "Interface"
  subnet_ids = module.network.private_subnet.id_all
  security_group_ids = [module.network.security_group_id["sg-endpoint"]]
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id = module.network.vpc_id
  service_name = "com.amazonaws.us-east-2.ecr.api"
  vpc_endpoint_type = "Interface"
  subnet_ids = module.network.private_subnet.id_all
  security_group_ids = [module.network.security_group_id["sg-endpoint"]]
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "logs" {
  vpc_id = module.network.vpc_id
  service_name = "com.amazonaws.us-east-2.logs"
  vpc_endpoint_type = "Interface"
  subnet_ids = module.network.private_subnet.id_all
  security_group_ids = [module.network.security_group_id["sg-endpoint"]]
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "ssm" {
  vpc_id = module.network.vpc_id
  service_name = "com.amazonaws.us-east-2.ssm"
  vpc_endpoint_type = "Interface"
  subnet_ids = module.network.private_subnet.id_all
  security_group_ids = [module.network.security_group_id["sg-endpoint"]]
  private_dns_enabled = true
}

resource "aws_vpc_endpoint" "rds" {
  vpc_id = module.network.vpc_id
  service_name = "com.amazonaws.us-east-2.rds"
  vpc_endpoint_type = "Interface"
  subnet_ids = module.network.private_subnet.id_all
  security_group_ids = [module.network.security_group_id["sg-endpoint"]]
  private_dns_enabled = true
}


###############################################
# Route 53
###############################################

resource "aws_route53_zone" "logorg" {
  name = "www.logorg.work"
}

# SSL #########################################
resource "aws_acm_certificate" "main" {
  domain_name = "www.logorg.work"

  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name = dvo.resource_record_name
      record = dvo.resource_record_value
      type = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  ttl = 60
  zone_id = aws_route53_zone.logorg.id
  name = each.value.name
  type = each.value.type
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "main" {
  certificate_arn = aws_acm_certificate.main.arn
  validation_record_fqdns = [ for record in aws_route53_record.validation : record.fqdn ]
}

# lb alias ####################################
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.logorg.id
  name = "www.logorg.work"
  type = "A"

  alias {
    name = aws_lb.main.dns_name
    zone_id = aws_lb.main.zone_id
    evaluate_target_health = true
  }
}
