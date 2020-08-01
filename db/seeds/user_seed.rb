def gen_user_params(n)
  {
    public_id: "user_#{n}",
    name: "user name #{n}",
    email: "email#{n}@example.com",
    password: "password",
    password_confirmation: "password"
  }
end


ActiveRecord::Base.transaction do
  30.times do |n|
    User.create( gen_user_params(n) )
  end
end
