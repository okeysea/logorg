class UsersController < ApplicationController
  before_action :correct_user, only: %i[edit update]
  before_action :already_logged_in, only: %i[new create] # 既にログインしている場合はユーザーページへ

  # ユーザー個別ページ
  def show
    @user = User.find_by(public_id: params[:public_id].downcase)
    @posts = Post.preload(:user)
      .where(user_id: @user.id)
      .order(created_at: :desc)
      .page(params[:page])
      .per(5)
  end

  # ユーザー登録
  def new
    render layout: "non-header-footer-layout"
    @user = User.new
  end

  # def create
  #   @user = User.new(user_params)
  #   if @user.save
  #     redirect_to @user
  #   else
  #     render 'new', layout: "non-header-footer-layout"
  #   end
  # end

  # ユーザ情報編集
  def edit
    @user = User.find_by(public_id: params[:public_id].downcase)
  end

  # def update
  #   @user = User.find_by(public_id: params[:public_id].downcase)
  #   if @user.update(patch_user_params)
  #     flash_message(:success, t('.profile_updated'))
  #     redirect_to @user
  #   else
  #     flash_message(:danger, t('.profile_update_failed'))
  #     render 'edit'
  #   end
  # end

  private

    def user_params
      params.require(:user).permit(:public_id, :name, :email, :password,
                                   :password_confirmation)
    end

    def patch_user_params
      params.require(:user).permit(:name, :password,
                                   :password_confirmation, :avatar)
    end

    # before actions --

    def correct_user
      @user = User.find_by(public_id: params[:public_id].downcase)
      redirect_to(root_url) unless current_user?(@user)
    end

    def already_logged_in
      redirect_to @current_user if logged_in?
    end
end
