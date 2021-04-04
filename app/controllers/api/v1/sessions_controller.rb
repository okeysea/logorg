class Api::V1::SessionsController < ApplicationController
  include ApiCommonRender

  # ログアウト
  def destroy
    if logged_in?
      log_out
      flash_message :success, t('.success_logout')
      render :destroy, status: :no_content and return
    end
    render :destroy, status: :bad_request and return
  end

end
