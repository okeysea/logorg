if Rails.env.production?
  CarrierWave.configure do |config|
    config.asset_host = ENV.fetch("PROJECT_HOST_NAME", "http://localhost")
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
