locals {

  ##
  ## SUBNETS
  ##
  # 正規化する( Optional を実現 )
  subnets = { for k, v in var.subnets : k => merge({ use = null, nat = null }, v) }

  # タイプ別ユーティリティー
  private_subnets = { for k, v in local.subnets : k => v if v.type == "private" }
  public_subnets  = { for k, v in local.subnets : k => v if v.type == "public" }

  # Natを構築するサブネット
  use_nat_subnets = {
    for k, v in local.public_subnets : k => v if v.use == "NAT"
  }

  # 使用するNatが指定されていない場合に使うPrivate Subnet用のNat
  first_nat_key = length( local.use_nat_subnets ) != 0 ? [for k, v in local.use_nat_subnets : k][0] : ""
  
  # Nat を生成するかどうか
  gen_nat = local.first_nat_key == "" ? false : true

  # サブネットキーから各種属性を得るハッシュ
  subnet_id_from_key   = { for k, v in var.subnets : k => aws_subnet.this[k].id }
  subnet_cidr_from_key = { for k, v in var.subnets : k => aws_subnet.this[k].cidr_block }

  ##
  ## SUBNET GROUPS
  ##

  subnet_groups = var.subnet_groups

  # サブネットグループに所属しているサブネットのidの配列を得る
  subnet_groups_subnet_ids = {
    for k, v in local.subnet_groups
    : k => [
      for subnet_key in v.subnet_keys : local.subnet_id_from_key[subnet_key]
    ]
  }

  # サブネットグループに所属しているサブネットのcidr_blocsの配列を得る
  subnet_groups_cidrs_from_key = {
    for k, v in local.subnet_groups
    : k => [
      for subnet_key in v.subnet_keys : local.subnet_cidr_from_key[subnet_key]
    ]
  }

  # DB用サブネットGroup
  db_subnet_groups = {
    for k, v in local.subnet_groups : k => v if v.type == "DB"
  }

  ##
  ## Security Groups
  ##
  security_groups = {
    for sg_k, sg_v in var.security_groups : sg_k => {
      name = sg_v.name

      # ingress 構築
      ingress = [
        for sg_rulename in sg_v.ingress_rules
        : local.security_group_rules[sg_rulename]
      ]

      # engress 正規化
      egress = [
        for sg_rulename in sg_v.egress_rules
        : local.security_group_rules[sg_rulename]
      ]
    }
  }

  ##
  ## Security Group Rules
  ##

  # デフォルトの定義
  security_group_rules_default = [
    { name = "http", from_to = "80-80-tcp", cidrs = { cidr_blocks = ["0.0.0.0/0"] }, description = "default http rule" },
    { name = "all", from_to = "all", cidrs = { cidr_blocks = ["0.0.0.0/0"] }, description = "default all rule" }
  ]

  security_group_rules_cidrs = {
    for v in concat(local.security_group_rules_default, var.security_group_rules)
    : v.name => merge({
      cidr_blocks       = []
      subnet_keys       = []
      subnet_group_keys = []
    }, v.cidrs)
  }

  # 正規化
  security_group_rules = {
    for v in concat(local.security_group_rules_default, var.security_group_rules)
    : v.name => merge({
      description         = ""
      security_group_keys = []

      cidr_blocks       = []
      subnet_keys       = []
      subnet_group_keys = []
      }, merge(v, {
        cidr_blocks       = local.security_group_rules_cidrs[v.name].cidr_blocks
        subnet_keys       = local.security_group_rules_cidrs[v.name].subnet_keys
        subnet_group_keys = local.security_group_rules_cidrs[v.name].subnet_group_keys
    }))
  }


  Names = {
    VPC = "vpc-${var.vpc_name}"

    Subnet = {
      for k, v in local.subnets : k => "subnet[${k}](${v.name})#${v.type}"
    }
  }

}

####################################
# VPC, Subnet構築
####################################

resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr_block

  enable_dns_hostnames = var.vpc_enable_dns_hostnames
  enable_dns_support   = var.vpc_enable_dns_support

  tags = {
    Name = local.Names.VPC
    Type = "vpc"
  }
}

resource "aws_subnet" "this" {
  for_each = var.subnets

  vpc_id            = aws_vpc.vpc.id
  availability_zone = each.value.zone

  cidr_block = var.subnets[each.key].cidr

  tags = {
    Name = "vpc-${var.vpc_name}-[${each.key}]-${each.value.type}"
    Type = "${each.value.type}-subnet"
  }
}

####################################
# ゲートウェイ
####################################

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "igw-vpc-${var.vpc_name}"
    Type = "igw"
  }
}

#
# NAT Gateway は Public Subnet に構築する必要がある
# EIPがひとつ必要, AZごとにNATひとつ？
#
resource "aws_eip" "nat_gateway" {
  for_each = local.use_nat_subnets
  vpc      = true

  tags = {
    Name = "eip-vpc-${var.vpc_name}-nat-gateway[${each.key}]"
    Type = "eip"
  }
}

resource "aws_nat_gateway" "this" {
  for_each = local.use_nat_subnets

  allocation_id = aws_eip.nat_gateway[each.key].id
  subnet_id     = aws_subnet.this[each.key].id

  tags = {
    Name = "nat-${var.vpc_name}-subnet[${each.key}]}"
    Type = "nat_gateway"
  }
}

####################################
# ルーティング
####################################

# ----------------
# PUBLIC
# ----------------
resource "aws_route_table" "public" {
  for_each = local.public_subnets

  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "rt-vpc-${var.vpc_name}-public"
    Type = "public-route-table"
  }
}

resource "aws_route_table_association" "public" {
  for_each = local.public_subnets

  subnet_id      = aws_subnet.this[each.key].id
  route_table_id = aws_route_table.public[each.key].id
}

resource "aws_route" "public" {
  for_each               = local.public_subnets

  route_table_id         = aws_route_table.public[each.key].id
  gateway_id             = aws_internet_gateway.this.id
  destination_cidr_block = "0.0.0.0/0"
}

# ----------------
# PRIVATE
# ----------------
resource "aws_route_table" "private" {
  for_each = local.private_subnets

  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "rt-vpc-${var.vpc_name}-private[${each.key}]"
    Type = "private-route-table"
  }
}

resource "aws_route_table_association" "private" {
  for_each = local.private_subnets

  subnet_id      = aws_subnet.this[each.key].id
  route_table_id = aws_route_table.private[each.key].id
}

resource "aws_route" "private" {
  for_each = local.gen_nat ? local.use_nat_subnets : {}

  route_table_id         = aws_route_table.private[each.key].id
  gateway_id             = aws_nat_gateway.this[coalesce(each.value.nat, local.first_nat_key)].id
  destination_cidr_block = "0.0.0.0/0"
}

# resource "aws_route_table_association" "private" {
#   for_each = local.gen_nat ? local.private_subnets : {}
# 
#   subnet_id      = aws_subnet.this[each.key].id
#   route_table_id = aws_route_table.private[coalesce(each.value.nat, local.first_nat_key)].id
# }
# 
# resource "aws_route" "private" {
#   for_each = local.use_nat_subnets
# 
#   route_table_id         = aws_route_table.private[each.key].id
#   gateway_id             = aws_nat_gateway.this[each.key].id
#   destination_cidr_block = "0.0.0.0/0"
# }


####################################
# グルーピング
####################################

resource "aws_db_subnet_group" "this" {
  for_each = local.db_subnet_groups

  name       = each.value.name
  subnet_ids = local.subnet_groups_subnet_ids[each.key]

  tags = {
    Name = "db_subnet_group-${each.key}-${each.value.name}"
  }
}

####################################
# セキュリティグループ
# TODO: security_groups support
####################################

resource "aws_security_group" "this" {
  for_each = local.security_groups

  name   = each.value.name
  vpc_id = aws_vpc.vpc.id

  dynamic "ingress" {
    for_each = each.value.ingress

    content {
      description = ingress.value.description
      from_port = tonumber(
        ingress.value.from_to == "all" ? 0 : split("-", ingress.value.from_to)[0]
      )
      to_port = tonumber(
        ingress.value.from_to == "all" ? 0 : split("-", ingress.value.from_to)[1]
      )
      protocol = ingress.value.from_to == "all" ? "-1" : split("-", ingress.value.from_to)[2]

      cidr_blocks = concat(
        ingress.value.cidr_blocks,
        [for subnet_key in ingress.value.subnet_keys : local.subnet_cidr_from_key[subnet_key]],
        flatten([for subnet_group_key in ingress.value.subnet_group_keys
        : local.subnet_groups_cidrs_from_key[subnet_group_key]])
      )

    }

  }

  dynamic "egress" {
    for_each = each.value.egress

    content {
      description = egress.value.description
      from_port   = tonumber(egress.value.from_to == "all" ? 0 : split("-", egress.value.from_to)[0])
      to_port     = tonumber(egress.value.from_to == "all" ? 0 : split("-", egress.value.from_to)[1])
      protocol    = egress.value.from_to == "all" ? "-1" : split("-", egress.value.from_to)[2]
      cidr_blocks = concat(
        egress.value.cidr_blocks,
        [for subnet_key in egress.value.subnet_keys : local.subnet_cidr_from_key[subnet_key]],
        flatten([for subnet_group_key in egress.value.subnet_group_keys
        : local.subnet_groups_cidrs_from_key[subnet_group_key]])
      )
    }

  }

  tags = {
    Name = "sg-${local.Names.VPC}-${each.value.name}"
  }
}
