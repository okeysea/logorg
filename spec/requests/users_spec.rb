require 'rails_helper'

RSpec.describe "Users", type: :request do

  describe "GET /signup" do
    it "is response to 200" do
      get signup_path
      expect(response).to have_http_status(200)
    end
  end

  describe "POST /signup" do
    describe "valid signup information" do
      before do
        @before_count = User.count
        @user = build(:user)
        post signup_path, params: { user: {
          public_id: @user.public_id,
          name: @user.name,
          email: @user.email,
          password: @user.password,
          password_confirmation: @user.password_confirmation
        } }
      end

      it "is User.count += 1 (success signup)" do
        expect(User.count).to eq(@before_count + 1)
      end

      it "is redirect to user page" do
        expect(response).to redirect_to("/users/#{@user.public_id}")
      end
    end

    describe "invalid signup information" do
      before do
        @before_count = User.count
        post signup_path, params: { user: {
          public_id: '',
          name: '',
          email: '',
          password: '',
          password_confirmation: ''
        } }
      end

      it "is failed signup" do
        expect(response).to have_http_status(200)
        expect(User.count).to eq(@before_count)
      end

      it "is response errors" do
        expect(response).to have_http_status(200)
        expect(response.body).to include('error_message')
      end
    end
  end
end
