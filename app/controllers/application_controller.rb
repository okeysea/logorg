class ApplicationController < ActionController::Base
  include SessionsHelper
  include FlashMessagesHelper

  before_action :share_var_js

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
        gon.user = current_user.slice(%i[public_id display_id name])
      else
        gon.logged_in = false
      end
    end
end
