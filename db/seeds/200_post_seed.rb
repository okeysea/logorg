def gen_post_params(touser)
  {
    user_id: touser,
    title: Faker::Music.album,
    content: Faker::Lorem.paragraph(sentence_count: 100),
    content_source: Faker::Lorem.paragraph(sentence_count: 100)
  }
end

user_count = User.all.count
user_count.times do |n|
  puts "Gen post for user_id: #{n}/#{user_count}"
  10.times do
    Post.create(gen_post_params(n))
  end
end

many_post_user = User.find_by(public_id: "many_posts_user")
puts "Gen post for many_posts_user"
100.times do
  Post.create(gen_post_params(many_post_user.id))
end
