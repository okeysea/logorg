class ApplicationController < ActionController::Base
  include SessionsHelper
  include FlashMessagesHelper

  private

    def logged_in_user
      return if logged_in?

      store_location
      flash_message(:danger, t('.please_login'))
      redirect_to login_url
    end
end
