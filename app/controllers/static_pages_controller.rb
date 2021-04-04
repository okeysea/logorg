class StaticPagesController < ApplicationController
  def home
    @posts = Post.order(updated_at: :desc).limit(20)
  end

  def help
  end
end
