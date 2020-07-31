class User < ApplicationRecord
  # 空文字は許可しない
  validates :public_id, :name, :email, :password_digest,
    presence: true

  # 一意である
  validates :public_id, :email, uniqueness: true

  # メールアドレスバリデーション
  validates :email, format: {
    with: /\A[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\z/, 
    message:"メールアドレスが誤った形式です"
  }

  validates :public_id, format: { with: /\A[a-zA-Z0-9_-]+\z/ }
  validates :name,      format: { with: // }

  validates :public_id, length: { in: 4..30 }
  validates :name,      length: { in: 1..12 }

  has_secure_password
end
