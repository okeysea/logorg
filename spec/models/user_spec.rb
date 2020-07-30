require 'rails_helper'

RSpec.describe User, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"

  # 公開ID,名前,メール,パスワードがあれば有効であること
  it "is valid with a public_id, name, email, and password_digest" do
    @user = User.new(
      public_id: "hogefuga",
      name: "adam_tesra",
      email: "example@example.com",
      password_digest: "password" # TODO: Digest
    )
    expect(@user).to be_valid
  end

  # 公開IDがなければ無効
  it "is invalid without public_id" do
    @user = User.new(
      name: "adam_tesra",
      email: "example@example.com",
      password_digest: "password" # TODO: Digest
    )
    expect(@user.valid?).to eq(false)
  end

  # 名前がなければ無効
  it "is invalid without name" do
    @user = User.new(
      public_id: "hogefuga",
      email: "example@example.com",
      password_digest: "password" # TODO: Digest
    )
    expect(@user.valid?).to eq(false)
  end

  # emailがなければ無効
  it "is invalid without email" do
    @user = User.new(
      public_id: "hogefuga",
      name: "adam_tesra",
      password_digest: "password" # TODO: Digest
    )
    expect(@user.valid?).to eq(false)
  end

  # password_digestがなければ無効
  it "is invalid without passowrd_digest" do
    @user = User.new(
      public_id: "hogefuga",
      name: "adam_tesra",
      email: "example@example.com",
    )
    expect(@user.valid?).to eq(false)
  end

end
