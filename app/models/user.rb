class User < ApplicationRecord
  include DataUriParseable

  mount_uploader :avatar, AvatarUploader

  has_many :posts, dependent: :destroy

  before_validation :save_id_on_display
  before_save :downcase_email, :downcase_public_id

  attr_accessor :activation_token
  before_create :create_activation_digest

  # data uriを変換
  attr_accessor :avatar_data_uri
  before_validation :set_avatar_from_data_uri, if: -> { self.avatar_data_uri.present? }

  ## validates ##

  # 空文字は許可しない
  validates :public_id, :name, :email, presence: true

  # 一意である( 大文字小文字は区別しない )
  validates :public_id, :email, uniqueness: { case_sensitive: false }

  # メールアドレスバリデーション
  validates :email, format: {
    with: %r{\A[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\z},
    message: "が誤った形式です"
  }

  validates :public_id, format: { with: /\A[a-zA-Z0-9_-]+\z/ }
  validates :name,      format: { with: // }

  validates :public_id, length: { in: 4..30 }
  validates :name,      length: { in: 1..30 }
  validates :email,     length: { maximum: 255 }

  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
  validate  :strong_password

  # custom validate
  def strong_password
    return if public_id.nil? || password.nil? || name.nil?

    strong_password_reject_char
    strong_password_continuous
    strong_password_only_number
    strong_password_include_other
  end

  # 半角英数字記号(半角スペース含む)以外の文字が使用されている
  def strong_password_reject_char
    return if password.nil?

    errors.add(:password, I18n.t('.errors.reject_char')) if password !~ /\A[ -~]+\z/
  end

  # 同一文字が連続している
  def strong_password_continuous
    return if password.nil?

    errors.add(:password, I18n.t('.errors.continuous')) if password =~ /(.)\1{3,}/
  end

  # 数字のみである
  def strong_password_only_number
    return if password.nil?

    errors.add(:password, I18n.t('.errors.only_number')) if password =~ /\A[0-9]+\z/
  end

  # public_id, name と部分一致
  def strong_password_include_other
    return if public_id.nil? || name.nil?

    errors.add(:password, I18n.t('.errors.include_other')) if password.include?(public_id) || password.include?(name)
  end

  ## logics ##

  # idではなく、public_idを返すオーバーライド
  # example:
  #   redirect_to @user
  def to_param
    display_id
  end

  # ユーザのログイン情報を破棄する
  def forget
    update_attribute(:remember_digest, nil)
  end

  # ユーザ入力のidと比較して違っていたら表示IDを更新
  def update_display_id(id)
    return unless public_id.eql?(id.downcase)
    return if display_id.eql?(id)

    update_attribute(:display_id, id)
  end

  # 文字列からダイジェストを生成
  def self.digest(string)
    cost =  if ActiveModel::SecurePassword.min_cost
              BCrypt::Engine::MIN_COST
            else
              BCrypt::Engine.cost
            end

    BCrypt::Password.create(string, cost: cost)
  end

  # ランダムなトークンを生成(base64)
  def self.new_token
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
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?

    BCrypt::Password.new(digest).is_password?(token)
  end

  # API用
  def api_avatars
    {
      thumb: avatar.url(:thumb),
      big: avatar.url(:big),
      middle: avatar.url(:middle),
      small: avatar.url(:small),
      adjust: avatar.url(:adjust),
      raw: avatar.url
    }
  end
 
  def api_details
    self.slice(%i[public_id display_id name email activated])
      .merge({avatar:api_avatars})
      .merge({posts_count: self.posts.count })
  end

  def api_general
    api_details.slice("public_id", "display_id", "name", "avatar", "posts_count")
  end

  # 評価用 ############
  def is_only_review?
    self.email =~ /@review.example.com$/
  end

  def is_skip_activation?
    self.email =~ /@activated.example.com$/
  end

  def is_reviewer?
    self.is_only_review? || self.is_skip_activation?
  end
  #####################

  private

    def set_avatar_from_data_uri
      self.avatar = self.class.data_uri_to_file(avatar_data_uri)
    end

    # 表示上では、大文字小文字を区別するために保存しておく
    def save_id_on_display
      self.display_id = public_id.dup
    end

    def downcase_email
      email.downcase!
    end

    def downcase_public_id
      public_id.downcase!
    end

    # 有効化トークン、ダイジェストを作成
    def create_activation_digest
      self.activation_token  = User.new_token
      self.activation_digest = User.digest(activation_token)
    end

end
