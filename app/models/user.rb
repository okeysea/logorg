class User < ApplicationRecord
  include Contracts::Core
  C=Contracts

  before_save { email.downcase! }

  # 空文字は許可しない
  validates :public_id, :name, :email, presence: true

  # 一意である( 大文字小文字は区別しない )
  validates :public_id, :email, uniqueness: { case_sensitive: false }

  # メールアドレスバリデーション
  validates :email, format: {
    with: /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\z/, 
    message:"メールアドレスが誤った形式です"
  }

  validates :public_id, format: { with: /\A[a-zA-Z0-9_-]+\z/ }
  validates :name,      format: { with: // }

  validates :public_id, length: { in: 4..30 }
  validates :name,      length: { in: 1..12 }
  validates :email,     length: { maximum: 255 }

  has_secure_password
  validates :password,  presence: true, length: { minimum: 6 }
  validate  :strong_password

  Contract C::Num, C::Num => C::Num
  def testcontract(a, b)
    a + b
  end

  def strong_password
    return if public_id.nil?
    return if password.nil?

    # 半角英数字記号(半角スペース含む)以外の文字が使用されている
    if password !~ /\A[ -~]+\z/
      errors.add(:password, "に、使用できない文字が含まれています")
    end
    # 同一文字が連続している
    if password =~ /(.)\1{3,}/
      errors.add(:password, "は、同一文字が4文字以上連続してはなりません")
    end
    # 数字のみである
    if password =~ /\A[0-9]+\z/
      errors.add(:password, "は、数字のみではなりません")
    end
    # public_id, name と部分一致
    if password.include?(public_id) || password.include?(name)
      errors.add(:password, "は、public id 又は name が含まれてはなりません")
    end
  end



end
