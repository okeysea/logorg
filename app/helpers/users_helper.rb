module UsersHelper
  def user_as_json(user)
    json = user.as_json(only: %i[public_id display_id name])
    json[:posts_count] = user.posts.size
    json
  end
end
