class UsersController < ApplicationController
  def show
    @user = User.find_by(public_id: params[:public_id])
  end

  def new
    render :layout => "non-header-footer-layout"

    @user = User.new
  end
end
