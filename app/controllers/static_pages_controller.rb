class StaticPagesController < ApplicationController
  def home
    @posts = Post.eager_load(:user).order(created_at: :desc).page(params[:page]).per(20)
  end

  def help
  end
end
