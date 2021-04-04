json.merge! @user.api_general
json.urls do
  json.user user_url(@user)
  json.posts user_posts_url(@user)
end
