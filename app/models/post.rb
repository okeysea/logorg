require './app/libs/convert_markdown'

class Post < ApplicationRecord
  @@convertMark = ConvertMarkdown.new()

  belongs_to :user

  before_validation :grant_id
  before_validation :convert_markdown

  validates :post_id, :user_id, :title, :content, :content_source, presence: true
  validates :post_id, uniqueness: true

  # urlのid表示を変更
  def to_param
    post_id
  end

  # API用
  def api_show
    self.slice(%i[post_id title content content_source created_at updated_at])
      .merge({owner: user.api_general})
  end

  private

    # post_idを付与する
    def grant_id
      return unless post_id.nil?

      self.post_id = SecureRandom.urlsafe_base64
    end

    def convert_markdown
      ast = @@convertMark.text_to_ast self.content_source 
      self.content =  @@convertMark.ast_to_html ast
      self.lead =     @@convertMark.ast_to_preview_html ast
    end

end
