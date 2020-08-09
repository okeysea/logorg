class SessionsController < ApplicationController

  def new
    render layout: 'non-header-footer-layout'
  end

  def create
    user_id = params[:session][:public_id]
    passwd  = params[:session][:password]
    @user = User.find_by(public_id: user_id.downcase)
    if @user&.authenticate(passwd)
      log_in @user
      # 表示IDをユーザ入力に更新
      @user.update_display_id(user_id)
      redirect_to @user
    else
      # 認証失敗メッセージの表示
      flash_message_now(:danger, t('.please_input_user_id')) if user_id.empty?
      flash_message_now(:danger, t('.please_input_password')) if passwd.empty?
      flash_message_now(:danger, t('.wrong_combinate')) unless user_id.empty? || passwd.empty?
      render 'new', layout: 'non-header-footer-layout'
    end
  end

  def destroy
  end
end
