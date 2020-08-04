class User < ApplicationRecord
  include Contracts::Core
  C=Contracts

  before_save { email.downcase! }

  attr_accessor :activation_token
  before_create :create_activation_digest


  ## validates ##

  # 空文字は許可しない
  validates :public_id, :name, :email, presence: true

  # 一意である( 大文字小文字は区別しない )
  validates :public_id, :email, uniqueness: { case_sensitive: false }

  # メールアドレスバリデーション
  validates :email, format: {
    with: /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\z/, 
    message:"が誤った形式です"
  }

  validates :public_id, format: { with: /\A[a-zA-Z0-9_-]+\z/ }
  validates :name,      format: { with: // }

  validates :public_id, length: { in: 4..30 }
  validates :name,      length: { in: 1..12 }
  validates :email,     length: { maximum: 255 }

  has_secure_password
  validates :password,  presence: true, length: { minimum: 6 }
  validate  :strong_password
  
  # custom validate
  def strong_password
    return if public_id.nil?
    return if password.nil?
    return if name.nil?

    # 半角英数字記号(半角スペース含む)以外の文字が使用されている
    if password !~ /\A[ -~]+\z/
      errors.add(:password, I18n.t('.errors.reject_char'))
    end
    # 同一文字が連続している
    if password =~ /(.)\1{3,}/
      errors.add(:password, I18n.t('.errors.continuous'))
    end
    # 数字のみである
    if password =~ /\A[0-9]+\z/
      errors.add(:password, I18n.t('.errors.only_number'))
    end
    # public_id, name と部分一致
    if password.include?(public_id) || password.include?(name)
      errors.add(:password, I18n.t('.errors.include_other'))
    end
  end

  ## logics ##

=begin
  Contract C::Num, C::Num => C::Num
  def testcontract(a, b)
    a + b
  end
=end

  
  # idではなく、public_idを返すオーバーライド
  # example:
  #   redirect_to @user
  def to_param
    public_id
  end

  # 文字列からダイジェストを生成
  Contract String => String
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # ランダムなトークンを生成(base64)
  Contract C::None => String
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  # メールアドレスを有効化する
  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  # アクティベーションメールを送信する
  def send_activation_mail
    UserMailer.account_activation(self).deliver_now
  end

  # トークンがダイジェストと一致したらTrueを返す
  Contract String, String => C::Bool
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end

  private

    # 有効化トークン、ダイジェストを作成
    Contract C::None => String
    def create_activation_digest
      self.activation_token  = User.new_token
      self.activation_digest = User.digest(activation_token)
    end

end
