module SessionsHelper

  # 渡されたユーザでログイン
  def log_in(user)
    session[:user_id] = user.public_id
  end

  # 永続セッションの設定
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.public_id
    cookies.permanent[:remember_token] = user.remember_token
  end

  # 永続セッションの破棄
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

end
