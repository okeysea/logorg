class ApplicationController < ActionController::Base
  include SessionsHelper
  include FlashMessagesHelper

  before_action :share_var_js
  before_action :account_activation_notice

  private

    def logged_in_user
      return if logged_in?

      store_location
      flash_message(:danger, t('.please_login'))
      redirect_to login_url
    end

    def share_var_js
      if logged_in? then
        gon.logged_in = true
        gon.user = current_user.api_details
      else
        gon.logged_in = false
      end
      gon.flash = flash
    end

    def account_activation_notice
      return unless logged_in?
      return if current_user.activated

      flash_message(:notice, "メールアドレスを有効化してください")
    end
end
