locals {
  bucket_name = "logorg-cdn-01"
}

resource "aws_s3_bucket" "logorg_cdn" {
  bucket = local.bucket_name
  acl    = "private"

  policy = data.aws_iam_policy_document.logorg_cdn_bucket_policy.json

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

locals {
  s3_logorg_cdn_origin_id = "s3_origin_id_${aws_s3_bucket.logorg_cdn.bucket}"
}

data "aws_iam_policy_document" "logorg_cdn_bucket_policy" {
  statement {
    sid    = ""
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.logorg_cdn_identity.iam_arn]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "arn:aws:s3:::${local.bucket_name}",
      "arn:aws:s3:::${local.bucket_name}/*"
    ]
  }
}

resource "aws_cloudfront_distribution" "logorg_cdn_dst" {
  origin {
    domain_name = aws_s3_bucket.logorg_cdn.bucket_regional_domain_name
    origin_id   = local.s3_logorg_cdn_origin_id
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.logorg_cdn_identity.cloudfront_access_identity_path
    }
  }

  enabled = true

  aliases = ["cdn.logorg.work"]

  default_root_object = "index.html"
  wait_for_deployment = true

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cdn.arn
    # cloudfront_default_certificate = true
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  custom_error_response {
    error_code         = "404"
    response_code      = "200"
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_logorg_cdn_origin_id
    compress               = true
    viewer_protocol_policy = "allow-all"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

}

resource "aws_cloudfront_origin_access_identity" "logorg_cdn_identity" {
  #comment = "logorg_cdn_identity"
}

resource "aws_ssm_parameter" "logorg_cdn_bucket_name" {
  name  = "LOGORG_CDN_AWS_BUCKET_NAME"
  type  = "SecureString"
  value = aws_s3_bucket.logorg_cdn.bucket
}

resource "aws_ssm_parameter" "logorg_cdn_region" {
  name  = "LOGORG_CDN_AWS_REGION"
  type  = "SecureString"
  value = aws_s3_bucket.logorg_cdn.region
}
