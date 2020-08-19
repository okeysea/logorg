def gen_post_params(touser)
  {
    user_id: touser,
    post_id: SecureRandom.urlsafe_base64,
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
