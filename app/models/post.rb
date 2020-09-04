class Post < ApplicationRecord
  belongs_to :user

  before_validation :grant_id

  validates :post_id, :user_id, :title, :content, :content_source, presence: true
  validates :post_id, uniqueness: true

  def to_param
    post_id
  end

  private

    # post_idを付与する
    def grant_id
      return unless post_id.nil?

      self.post_id = SecureRandom.urlsafe_base64
    end

end
