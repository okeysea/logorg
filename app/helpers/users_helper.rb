module UsersHelper
  def user_as_json(user)
    json = user.as_json(only: %i[public_id display_id name])
    json[:posts_count] = user.posts.size
    json
  end

  def user_side_nav_item(title, url, resource, select)
    classname = "select" if resource == select
    link_to title, url, class: classname
  end
end
