def gen_user_params(num)
  {
    public_id: "user_#{num}",
    name: "user name #{num}",
    email: "email#{num}@example.com",
    password: "password",
    password_confirmation: "password"
  }
end

def gen_user_mixedcase_id_params(num)
  {
    public_id: "MiXeD_#{num}",
    name: "MixEd User #{num}",
    email: "email_mixed_#{num}@example.com",
    password: "password",
    password_confirmation: "password"
  }
end


ActiveRecord::Base.transaction do
  30.times do |n|
    User.create( gen_user_params(n) )
    User.create( gen_user_mixedcase_id_params(n) )
  end
end
