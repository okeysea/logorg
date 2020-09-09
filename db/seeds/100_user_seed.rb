def gen_user_params(pub_id, name, email)
  {
    public_id: pub_id,
    name: name,
    email: email,
    password: "password",
    password_confirmation: "password"
  }
end

def gen_user_test_params(num)
  gen_user_params "user_#{num}", "user name #{num}", "email#{num}@example.com"
end

def gen_user_mixedcase_id_params(num)
  gen_user_params "MiXeD_#{num}", "MixEd User #{num}", "email_mixed_#{num}@example.com"
end

ActiveRecord::Base.transaction do
  30.times do |n|
    User.create(gen_user_test_params(n))
    User.create(gen_user_mixedcase_id_params(n))
  end
  User.create(gen_user_params("many_posts_user", "ManyPostUser", "manypostuser@example.com"))
end
