if Rails.env.production?
  CarrierWave.configure do |config|
    config.asset_host = "http://you.need.change.carrierwave.configure.production"
  end
end

if Rails.env.development?
  CarrierWave.configure do |config|
    config.asset_host = "http://localhost:3000"
  end
end

if Rails.env.test?
  CarrierWave.configure do |config|
    config.asset_host = "http://example.com"
  end
end
