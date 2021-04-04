json.array! @users do |user|
  json.merge! user.api_general
end
