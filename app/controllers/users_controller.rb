class UsersController < ApplicationController
  def show
    @user = User.find_by(public_id: params[:public_id])
  end

  def new
    @user = User.new
  end
end
