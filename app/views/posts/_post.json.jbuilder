json.extract! post, :id, :user_id, :post_id, :title, :content, :content_source, :created_at, :updated_at
json.url user_post_url(post, format: :json)
