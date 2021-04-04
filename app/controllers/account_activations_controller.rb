class AccountActivationsController < ApplicationController

  # /account_activations/:id/edit?email=xxx@xxx.xxx
  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      flash_message(:success, "メールアドレス認証が完了しました")
      user.activate
    else
      flash_message(:warning, "メールアドレスが有効ではありません")
      redirect_to root_path
    end
  end
end
