output "vpc_id" {
  value = aws_vpc.vpc.id
}

output "vpc" {
  value = aws_vpc.vpc
}

output "subnets" {
  value = aws_subnet.this
}

output "public_subnet" {
  value = {
    id_all = [
      for k, v in var.subnets
      : aws_subnet.this[k].id if v.type == "public"
    ]

    key_all = [
      for k, v in var.subnets
      : k if v.type == "public"
    ]

    key_all_map = {
      for k, v in var.subnets
      : k => k if v.type == "public"
    }
  }
}

output "private_subnet" {
  value = {
    id_all = [
      for k, v in var.subnets
      : aws_subnet.this[k].id if v.type == "private"
    ]

    key_all = [
      for k, v in var.subnets
      : k if v.type == "private"
    ]

    key_all_map = {
      for k, v in var.subnets
      : k => k if v.type == "private"
    }
  }
}

output "public_subnets_ids" {
  description = "パブリックなサブネットのIDを参照できます"
  value = {
    for k, v in var.subnets
    : k => aws_subnet.this[k].id if v.type == "public"
  }
}

output "private_subnets_ids" {
  description = "プライベートなサブネットのIDを参照できます"
  value = {
    for k, v in var.subnets
    : k => aws_subnet.this[k].id if v.type == "private"
  }
}

output "public_route_table" {
  value = {
    for k, v in var.subnets
    : k => aws_route_table.public[k] if v.type == "public"
  }
}

output "private_route_table" {
  value = {
    for k, v in var.subnets
    : k => aws_route_table.private[k] if v.type == "private"
  }
}

output "security_group_id" {
  value = {
    for sg_k, sg_v in var.security_groups : sg_k => aws_security_group.this[sg_k].id
  }
}

output "security_group" {
  value = {
    for sg_k, sg_v in var.security_groups : sg_k => aws_security_group.this[sg_k]
  }
}

output "subnet_group" {
  value = {
    db = { for k, v in local.db_subnet_groups : k => aws_db_subnet_group.this[k] }
  }
}
