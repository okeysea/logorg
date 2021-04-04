json.merge! @post.api_show
json.urls do
  json.post user_post_url(@post.user, @post)
end
