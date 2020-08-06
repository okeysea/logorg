class AccountActivationsController < ApplicationController

  # /account_activations/:id/edit?email=xxx@xxx.xxx
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.activate
    else
      redirect_to root_path
    end
  end
end
