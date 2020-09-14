require 'rails_helper'

RSpec.describe "Users", type: :request do

  describe "GET /signup" do
    it "is response to 200" do
      get signup_path
      expect(response).to have_http_status(200)
    end
  end

  describe "POST /signup" do
    context "valid signup information" do
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

    context "invalid signup information" do
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

    describe "user logged in" do
      before do
        @okeysea = create(:okeysea)
        post login_path, params: { session: {
          # リダイレクト先はDisplay_idになるため
          public_id: @okeysea.display_id,
          password: @okeysea.password
        } }
      end

      it "is redirect to user page" do
        post signup_path, params: { user: {
          public_id: 'loggedinuserpost',
          name: 'loggedin user',
          email: 'loggedin@example.com',
          password: 'hogehogehoge',
          password_confirmation: 'hogehogehoge'
        } }
        expect(response).to redirect_to(@okeysea)
      end
    end
  end

  describe "GET /signup" do
    context "user logged in" do
      before do
        @okeysea = create(:okeysea)
        post login_path, params: { session: {
          # リダイレクト先はDisplay_idになるため
          public_id: @okeysea.display_id,
          password: @okeysea.password
        } }
      end

      it "is redirect to user page" do
        get signup_path
        expect(response).to redirect_to(@okeysea)
      end
    end
  end

  describe "GET /edit" do
    context "user not logged in" do
      before do
        @okeysea = create(:okeysea)
      end

      it "is redirect to root page" do
        get edit_user_path(@okeysea)
        expect(response).to redirect_to(root_path)
      end
    end

    context "user logged in" do
      before do
        @okeysea = create(:okeysea)
        post login_path, params: { session: {
          # リダイレクト先はDisplay_idになるため
          public_id: @okeysea.display_id,
          password: @okeysea.password
        } }
      end

      it "is response status 200" do
        get edit_user_path(@okeysea)
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "PATCH /users" do
    before do
      @okeysea = create(:okeysea)
      @takashi = create(:takashi)
    end

    context "user not logged in" do
      it "is redirect to root page" do
        patch user_path(@okeysea), params: { user: {
          public_id: "New_ID"
        } }
        expect(response).to redirect_to(root_path)
      end
    end

    context "user logged in different account" do
      before do
        post login_path, params: { session: {
          # リダイレクト先はDisplay_idになるため
          public_id: @takashi.display_id,
          password: @takashi.password
        } }
      end

      it "is redirect to root page" do
        patch user_path(@okeysea), params: { user: {
          public_id: "New_ID"
        } }
        expect(response).to redirect_to(root_path)
      end
    end

    context "user logged in" do
      before do
        post login_path, params: { session: {
          # リダイレクト先はDisplay_idになるため
          public_id: @okeysea.display_id,
          password: @okeysea.password
        } }
      end

      context "request update for public_id" do
        it "is unchanged public_id" do
          patch user_path(@okeysea), params: { user: {
            public_id: "New_ID"
          } }
          expect(@okeysea.reload.public_id).to_not eq("New_ID".downcase)
        end
      end

      context "request update for name" do
        it "is changed name and response success message" do
          patch user_path(@okeysea), params: { user: {
            name: "changed name"
          } }
          expect(@okeysea.reload.name).to eq("changed name")
          expect(response.body).to include("success")
        end
      end

      xcontext "request update for email" do
        it "is changed email and response success message" do
          patch user_path(@okeysea), params: { user: {
            email: "okeysea_change@example.com"
          } }
          expect(@okeysea.reload.email).to eq("okeysea_change@example.com")
          expect(response.body).to include("success")
        end
      end

      context "request update for password" do
        it "is changed password and response success message" do
          patch user_path(@okeysea), params: { user: {
            password: "changed",
            password_confirmation: "changed"
          } }
          expect(@okeysea.reload.authenticate("changed")).to_not eq(false)
          expect(response.body).to include("success")
        end
      end
    end
  end

  describe "GET /show" do
    before do
      @okeysea = create(:okeysea)
      @takashi = create(:takashi)
    end

    it "is renders a successful response" do
      get user_url(@okeysea)
      expect(response).to be_successful
    end

    context "user logged in" do
      before do
        log_in @okeysea
      end
      it "is renders a successful response" do
        get user_url(@okeysea)
        expect(response).to be_successful
      end
    end

    context "user logged in other user" do
      before do
        log_in @takashi
      end
      it "is renders a successful response" do
        get user_url(@okeysea)
        expect(response).to be_successful
      end
    end
  end
end
