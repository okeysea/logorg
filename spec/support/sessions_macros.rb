module SessionsMacros

  def log_in(user)
    post login_path, params: { session: {
      # リダイレクト先はDisplay_idになるため
      public_id: user.display_id,
      password: user.password
    } }
  end

  def log_out
    delete logout_path
  end

  def act_as(user)
    log_in user
    yield
    log_out
  end

end
