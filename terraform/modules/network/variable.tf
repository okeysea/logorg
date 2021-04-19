variable "vpc_name" {
  type    = string
  default = "logorg"
}

variable "vpc_cidr_block" {
  type    = string
  default = "10.0.0.0/16"
}

variable "vpc_enable_dns_hostnames" {
  type    = bool
  default = false
}

variable "vpc_enable_dns_support" {
  type    = bool
  default = false
}

variable "subnets" {
  type = map(any)

  ## 0.15.0 later ?
  #type = object({
  #  cidr = string
  #  zone = string
  #  name = string
  #  type = string
  #  use  = optional(string)
  #})

  default = {

    public-1a = {
      cidr = "10.0.1.0/24"
      zone = "ap-northeast-1a"
      name = "public-subnet"
      type = "public"
      use  = "NAT"
    }

    public_1c = {
      cidr = "10.0.2.0/24"
      zone = "ap-northeast-1c"
      name = "public-subnet"
      type = "public"
    }

    private-1a = {
      cidr = "10.0.10.0/24"
      zone = "ap-northeast-1a"
      name = "private-subnet"
      type = "private"
    }

    private-1c = {
      cidr = "10.0.10.0/24"
      zone = "ap-northeast-1c"
      name = "private-subnet"
      type = "private"
    }
  }
}

variable "subnet_groups" {
  type = map(any)

  default = {
    db-group = {
      type        = "DB"
      subnet_keys = ["private-1a", "private-1c"]
      name        = "private-db"
    }
  }
}

variable "security_groups" {
  type = map(any)
  #type         = map(object({ name = string, ingress = list(any), egress = list(any) }))
  description = <<EOF
    セキュリティーグループを定義します
    Attributes:
      name
      ingress_rules = list( security_group_rules.name )
      egress_rules  = list( security_group_rules.name )
  EOF

  default = {
    sg-default = {
      name          = "default-security_groups"
      ingress_rules = []
      egress_rules  = []
    }
  }
}

variable "security_group_rules" {
  type = list(any)

  description = <<EOF
    セキュリティーグループルールを定義します
    Attributes:
  EOF

  default = [
    { name = "http", from_to = "80-80-tcp", cidrs = { cidr_blocks = ["0.0.0.0/0"] } }
  ]
}
