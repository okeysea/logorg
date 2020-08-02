class UsersController < ApplicationController
  def show
    @user = User.find_by(public_id: params[:public_id])
  end

  def new
    render :layout => "non-header-footer-layout"
  end

  def create
    @user = User.new(user_params)
    if @user.save
    else
      render 'new', :layout => "non-header-footer-layout"
    end
  end

  private
    
    def user_params
      params.require(:user).permit( :public_id, :name, :email, :password,
                                    :password_confirmation )
    end
end
