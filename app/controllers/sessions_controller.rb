class SessionsController < ApplicationController

  def new
    render layout: 'non-header-footer-layout'
  end

  def create
    @user = User.find_by(public_id: params[:session][:public_id].downcase)
    if @user&.authenticate(params[:session][:password])
      redirect_to @user
    else
      redirect_to root_path
    end
  end
end
