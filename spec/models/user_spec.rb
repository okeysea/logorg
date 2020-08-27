# rubocop:disable all
require 'rails_helper'

RSpec.describe User, type: :model do

  let(:params){ {
      public_id:             public_id,
      name:                  name,
      email:                 email,
      password:              password,
      password_confirmation: password_confirmation
  } }
  let(:public_id){            "hogefuga"}
  let(:name){                 "adam_tesra"} 
  let(:email){                "example@example.com"}
  let(:password){             "password"}
  let(:password_confirmation){"password"}

  let(:user){ User.new( params ) }
  subject { user.valid? }

  # 公開ID,名前,メール,パスワードがあれば有効であること
  it "is valid with a public_id, name, email, and password_digest" do
    is_expected.to eq(true)
  end

  context "public_id nil" do
    let(:public_id){ nil }
    # 公開IDがなければ無効
    it "is invalid without public_id" do
      is_expected.to eq(false)
    end
  end

  context "public_id empty" do
    let(:public_id){ "      " }
    # 公開IDがなければ無効
    it "is invalid without public_id" do
      is_expected.to eq(false)
    end
  end

  context "name nil" do
    let(:name){ nil }
    # 名前がなければ無効
    it "is invalid without name" do
      is_expected.to eq(false)
    end
  end

  context "email nil" do
    let(:email){ nil }
    # emailがなければ無効
    it "is invalid without email" do
      is_expected.to eq(false)
    end
  end

  context "password_digest nil" do
    let(:password){ nil }
    let(:password_confirmation){ nil }
    # パスワードがなければ無効
    it "is invalid without passowrd_digest" do
      is_expected.to eq(false)
    end
  end

  context "duplicate public_id" do
    # public_idが重複していたら無効
    it "is invalid with a duplicate public_id" do
      User.create(
        public_id: public_id.upcase,
        name: "hugehuge",
        email: "hugeman@example.com",
        password: "password",
        password_confirmation: "password"
      )
      is_expected.to eq(false)
    end
  end

  context "duplicate email" do
    # emailが重複していたら無効
    it "is invalid with a duplicate email" do
      User.create(
        public_id: "iamhugeman",
        name: "hugehuge",
        email: email,
        password: "password",
        password_confirmation: "password"
      )
      is_expected.to eq(false)
    end
  end

  # emailの書式があやまっているなら無効
  context "wrong format email" do
    it "is invalid" do
      ["example",
       "example@example.",
       "example@example.com.",
       "example@.example.com"].each do | adr |
        u = User.new(
          public_id: public_id,
          name: name,
          email: adr,
          password: password,
          password_confirmation: password_confirmation
        )
        expect(u.valid?).to eq(false)
      end
    end
  end

  # emailの書式が正しいなら有効
  context "right format email" do
    it "is valid" do
      ["example@example.com",
       "example@example.co.jp",
       "example+foo@example.com",
       "example@mail.example.com"].each do | adr |
        u = User.new(
          public_id: public_id,
          name: name,
          email: adr,
          password: password,
          password_confirmation: password_confirmation
        )
        expect(u.valid?).to eq(true)
      end
    end
  end

  # emailのダウンケースの検証
  context "email has mixed-case" do
    let(:email){ "MiXeD@eXaMpLe.cOm" }
    it "is should be saved as lower-case" do
      user.save
      expect(user.reload.email).to eq(email.downcase)
    end
  end

  # public_idの書式が正しいなら有効
  context "right format public_id" do
    it "is valid" do
      ["isvalid",
       "isValid",
       "isvalid_VALID",
       "is-_-Valid-_-si"].each do |pub_id|
        u = User.new(
          public_id: pub_id,
          name: name,
          email: email,
          password: password,
          password_confirmation: password_confirmation
        )
        expect(u.valid?).to eq(true)
      end
    end
  end

  # public_idの長さが30文字超
  context "public_id has length 30+" do
    let(:public_id){ "a" * 31 }
    it "is invalid" do
      is_expected.to eq(false)
    end
  end

  # public_idの長さが4文字未満
  context "public_id has length 4-" do
    let(:public_id){ "a" * 3 }
    it "is invalid" do
      is_expected.to eq(false)
    end
  end

  # public_idの長さが4-12文字以内
  context "public_id has length 4~30" do
    let(:public_id){ "a" * 10 }
    it "is valid" do
      is_expected.to eq(true)
    end
  end

  # public_idの長さが4-12文字以内(日本語)
  context "public_id has length 4~30(Japanese)" do
    let(:public_id){ "あ" * 10 }
    it "is invalid" do
      is_expected.to eq(false)
    end
  end

  # public_idの書式があやまっているなら無効
  context "wrong format public_id" do
    it "is invalid" do
      ["#invalid",
       "@invalid",
       "abcdefg#!",
       "*!@#$%^*&"].each do | pub_id |
        u = User.new(
          public_id: pub_id,
          name: name,
          email: email,
          password: password,
          password_confirmation: password_confirmation
        )
        expect(u.valid?).to eq(false)
      end
    end
  end

  # public_idのダウンケースの検証
  # display_idの検証
  context "public_id has mixed-case" do
    let(:public_id){ "MiXeDPuBlIcId" }
    it "is should be saved as lower-case" do
      user.save
      expect(user.reload.public_id).to eq(public_id.downcase)
    end
    describe "display_id" do
      it "is should be stored unchanged" do
        user.save
        expect(user.reload.display_id).to eq(public_id)
      end
    end
  end

  # update_display_id の検証
  describe "update_display_id" do
    let(:public_id){ "updatemyid" }
    context "input and id are the same" do
      it "is should be update" do
        user.save
        user.update_display_id("UpdateMyId")
        expect(user.display_id).to eq("UpdateMyId")
        expect(user.public_id).to eq("UpdateMyId".downcase)
      end
    end
    context "input and id are the different" do
      it "is should be unchanged" do
        user.save
        user.update_display_id("invalidMyId")
        expect(user.display_id).to_not eq("invalidMyId")
        expect(user.public_id).to_not eq("invalidMyId".downcase)
      end
    end
  end

  # パスワードが強力なら有効
  context "strong password" do
    it "is valid" do
      ["password",
       "paid response",
       "validPassWord#!",
       "*!@#$%^*&"].each do | pswd |
        u = User.new(
          public_id: public_id,
          name: name,
          email: email,
          password: pswd,
          password_confirmation: pswd
        )
        expect(u.valid?).to eq(true)
      end
    end
  end

  context "password has reject characters" do
    it "is invalid" do
      ["あいうえおかきくけこ",
       "\u202dcontrolcharactor\u202c",
       "\ub001Hangulcharactor" ].each do | pswd |
        u = User.new(
          public_id: public_id,
          name: name,
          email: email,
          password: pswd,
          password_confirmation: pswd
        )
        expect(u.valid?).to eq(false)
      end
    end
  end

  # 弱いパスワードなら無効
  context "weak password" do
    pw = 'aaaapassword'
    let(:password){ pw }
    let(:password_confirmation){ pw }
    it "'#{pw}' is invalid" do
      is_expected.to eq(false)
    end
  end

  context "weak password" do
    pw = 'passsssword'
    let(:password){ pw }
    let(:password_confirmation){ pw }
    it "'#{pw}' is invalid" do
      is_expected.to eq(false)
    end
  end

  context "weak password" do
    pw = '123456789'
    let(:password){ pw }
    let(:password_confirmation){ pw }
    it "'#{pw}' is invalid" do
      is_expected.to eq(false)
    end
  end

  # public_id の文字列が含まれているなら無効
  context "weak password" do
    let(:public_id){ "ducplicateid" } 
    pw = "sand_ducplicateid_sand"
    let(:password){ pw }
    let(:password_confirmation){ pw }
    it "'#{pw}' is invalid" do
      is_expected.to eq(false)
    end
  end

  # name の文字列が含まれているなら無効
  context "weak password" do
    let(:name){ "ducplicateid" } 
    pw = "sand_ducplicateid_sand"
    let(:password){ pw }
    let(:password_confirmation){ pw }
    it "'#{pw}' is invalid" do
      is_expected.to eq(false)
    end
  end

  context "short password (6-)" do
    pw = 'passw'
    let(:password){ pw }
    let(:password_confirmation){ pw }
    it "'#{pw}' is invalid" do
      is_expected.to eq(false)
    end
  end

end
