class UsersController < ApplicationController

  # ユーザー個別ページ
  def show
    @user = User.find_by(public_id: params[:public_id].downcase)
  end

  # ユーザー登録
  def new
    render layout: "non-header-footer-layout"
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user
    else
      render 'new', layout: "non-header-footer-layout"
    end
  end

  private

    def user_params
      params.require(:user).permit(:public_id, :name, :email, :password,
                                   :password_confirmation)
    end
end
