require 'rails_helper'

RSpec.describe User, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"

  # $B8x3+(BID,$BL>A0(B,$B%a!<%k(B,$B%Q%9%o!<%I$,$"$l$PM-8z$G$"$k$3$H(B
  it "is valid with a public_id, name, email, and password_digest" do
    @user = User.new(
      public_id: "hogefuga",
      name: "adam_tesra",
      email: "example@example.com",
      password_digest: "password" # TODO: Digest
    )
    expect(@user).to be_valid
  end

  # $B8x3+(BID$B$,$J$1$l$PL58z(B
  it "is invalid without public_id" do
    @user = User.new(
      name: "adam_tesra",
      email: "example@example.com",
      password_digest: "password" # TODO: Digest
    )
    expect(@user.valid?).to eq(false)
  end

  # $BL>A0$,$J$1$l$PL58z(B
  it "is invalid without name" do
    @user = User.new(
      public_id: "hogefuga",
      email: "example@example.com",
      password_digest: "password" # TODO: Digest
    )
    expect(@user.valid?).to eq(false)
  end

  # email$B$,$J$1$l$PL58z(B
  it "is invalid without email" do
    @user = User.new(
      public_id: "hogefuga",
      name: "adam_tesra",
      password_digest: "password" # TODO: Digest
    )
    expect(@user.valid?).to eq(false)
  end

  # password_digest$B$,$J$1$l$PL58z(B
  it "is invalid without passowrd_digest" do
    @user = User.new(
      public_id: "hogefuga",
      name: "adam_tesra",
      email: "example@example.com",
    )
    expect(@user.valid?).to eq(false)
  end

end
