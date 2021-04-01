class Api::V1::UsersController < ApplicationController
  include ApiCommonRender

  before_action :correct_user, only: %i[update]
  before_action :already_logged_in, only: %i[new create] # 既にログインしている場合はユーザーページへ

  # ユーザー一覧
  def index 
    @users = User.all
  end

  # ユーザー個別ページ
  def show
    @user = User.find_by(public_id: params[:public_id].downcase)
    if @user.nil?
      @message = "User not found"
      render :message, status: :not_found and return
    end

    # ログインしているユーザーの場合は詳細を出力
    render :show_details if current_user?( @user )
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @user = @user.reload
      render :show_details, status: :created and return
    else
      render_error_model @user and return 
    end
  end

  def update
    if @user.update(patch_user_params)
      @user = @user.reload
      render :show_details and return
    else
      render_error_model @user and return 
    end
  end

  def destroy
  end

  private

    def user_params
      params.require(:user).permit(:public_id, :name, :email, :password,
                                   :password_confirmation, :avatar_data_uri)
    end

    def patch_user_params
      params.require(:user).permit(:name, :password,
                                   :password_confirmation, :avatar_data_uri)
    end

    # before actions --

    def correct_user
      @user = User.find_by(public_id: params[:public_id].downcase)
      unless current_user?(@user)
        @message = "You need signup"
        render :message, status: :unauthorized
      end
    end

    def already_logged_in
      @message = "You already logged in"
      render :message, status: :bad_request if logged_in?
    end
end
