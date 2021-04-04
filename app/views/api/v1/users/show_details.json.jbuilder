json.merge! @user.api_details
json.urls do
  json.user user_url(@user)
  json.posts user_posts_url(@user)
  json.edit edit_user_url(@user)
  json.newPost new_user_post_url(@user)
end
