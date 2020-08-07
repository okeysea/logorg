FactoryBot.define do
  factory :user do
    public_id { "user_test" }
    name { "テストユーザー" }
    email { "test@example.com" }
    password { "password" }
    password_confirmation { "password" }
  end

  factory :okeysea, class: 'user' do
    public_id { "OkeySea" }
    name { "OkeySea" }
    email { "okeysea@example.com" }
    password { "password" }
    password_confirmation { "password" }
  end

  factory :takashi, class: 'user' do
    public_id { "takashi" }
    name { "たかし" }
    email { "takashi_t@example.com" }
    password { "password" }
    password_confirmation { "password" }
  end

end
