FactoryBot.define do
  factory :post do
    user_id { 1 }
    post_id { "MyString" }
    title { "MyString" }
    content { "MyString" }
    content_source { "MyString" }
  end
end
