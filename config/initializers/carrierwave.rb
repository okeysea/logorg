require 'carrierwave/storage/abstract'
require 'carrierwave/storage/file'
require 'carrierwave/storage/fog'

if Rails.env.production?
  CarrierWave.configure do |config|
    config.asset_host         = ENV.fetch("LOGORG_CDN_HOST_NAME", "https://www.logorg.work")

    config.storage :fog
    config.fog_provider       = 'fog/aws'
    config.fog_directory      = ENV.fetch("LOGORG_CDN_AWS_BUCKET_NAME", "")
    config.fog_public         = 'false'
    config.fog_credentials = {
      provider: "AWS",
      aws_access_key_id:      ENV.fetch("LOGORG_CDN_AWS_ACCESS_KEY_ID", ""),
      aws_secret_access_key:  ENV.fetch("LOGORG_CDN_AWS_SECRET_ACCESS_KEY", ""),
      region:                 ENV.fetch("LOGORG_CDN_AWS_REGION", ""),
      path_style: true
    }
  end
end

if Rails.env.development?
  CarrierWave.configure do |config|
    config.asset_host = ENV.fetch("PROJECT_HOST_NAME", "http://localhost")
  end
end

if Rails.env.test?
  CarrierWave.configure do |config|
    config.asset_host = "http://example.com"
  end
end
