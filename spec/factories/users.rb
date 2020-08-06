FactoryBot.define do
  factory :user do
    public_id { "user_test" }
    name { "テストユーザー" }
    email { "test@example.com" }
    password { "password" }
    password_confirmation { "password" }
  end
end
