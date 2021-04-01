require 'rails_helper'

RSpec.describe "API v1 Users", type: :request do

  describe "GET /users" do
    before(:each) do
      @okeysea = create(:okeysea)
      @takashi = create(:takashi)
      get api_v1_users_path
    end

    it "is response to 200" do
      expect(response).to have_http_status(200)
    end

    it "is respond user all general inform" do
      json = JSON.parse( response.body )
      expect( json[0].slice("public_id", "display_id", "name") ).to eq(@okeysea.slice(%i[public_id display_id name]))
      expect( json[0] ).to eq(@okeysea.api_general)
      expect( json[0] ).not_to eq(@okeysea)

      expect( json[1].slice("public_id", "display_id", "name") ).to eq(@takashi.slice(%i[public_id display_id name]))
      expect( json[1] ).to eq(@takashi.api_general)
      expect( json[1] ).not_to eq(@takashi)
    end
  end

  describe "POST /users" do
    let!(:okeysea) { create(:okeysea) }
    let!(:takashi) { build(:takashi) }

    let!(:valid_params) {
      {
        public_id: takashi.public_id,
        name: takashi.name,
        email: takashi.email,
        password: takashi.password,
        password_confirmation: takashi.password_confirmation
      }
    }

    let!(:invalid_params) {
      {
        public_id: "",
        name: "",
        email: "",
        password: "abc",
        password_confirmation: takashi.password_confirmation
      }
    }

    context "user logged in request valid params" do
      let!(:login) { log_in okeysea }

      subject! {
        post api_v1_users_path, params: { user: valid_params }
      }

      it "is response to 400 BAD REQUEST" do
        expect(response).to have_http_status(400)
      end
    end

    context "request valid params" do

      subject! {
        post api_v1_users_path, params: { user: valid_params }
      }

      it "is response to 201 CREATED" do
        expect(response).to have_http_status(201)
      end
    end

    context "request invalid params" do

      subject! {
        post api_v1_users_path, params: { user: invalid_params }
      }

      it "is response to 422 UNPROCESSABLE ENTITY" do
        expect(response).to have_http_status(422)
      end

      it "is respond message and errors" do
        json = JSON.parse( response.body )
        expect( json.key?("message") ).to eq(true)
        expect( json.key?("errors") ).to eq(true)
      end
    end
  end

  describe "GET /users/:public_id" do
    before(:each) do
      @okeysea = create(:okeysea)
      @takashi = create(:takashi)
    end

    context "request not exist user" do
      before(:each) do
        get api_v1_user_path(public_id: "not_exists")
      end

      it "is response to 404" do
        expect(response).to have_http_status(404)
      end

      it "is respond message" do
        json = JSON.parse( response.body )
        expect( json.key?("message") ).to eq(true)
      end

    end

    context "without logged in" do
      it "is respond user general inform" do
        get api_v1_user_path(@okeysea)
        expect(response).to have_http_status(200)

        json = JSON.parse( response.body )
        expect( json.slice("public_id","display_id","name") ).to eq(@okeysea.slice(%i[public_id display_id name]))
        expect( json ).to eq(@okeysea.api_general)
        expect( json ).not_to eq(@okeysea)
      end
    end

    context "with logged in" do
      before(:each) do
        log_in @okeysea
      end

      context "request logged in user" do
        before(:each) do
          get api_v1_user_path(@okeysea)
        end

        it "is response to 200" do
          expect(response).to have_http_status(200)
        end

        it "is respond detail inform" do
          json = JSON.parse( response.body )
          expect( json.slice("public_id","display_id","name","email","activated") ).to eq(@okeysea.slice(%i[public_id display_id name email activated]))
          expect( json ).to eq(@okeysea.api_details)
          expect( json ).not_to eq(@okeysea)
        end
      end

      context "request other user" do
        before(:each) do
          get api_v1_user_path(@takashi)
        end

        it "is response to 200" do
          expect(response).to have_http_status(200)
        end

        it "is respond general inform" do
          json = JSON.parse( response.body )
          expect( json.slice("public_id","display_id","name") ).to eq(@takashi.slice(%i[public_id display_id name]))
          expect( json ).to eq(@takashi.api_general)
          expect( json ).not_to eq(@takashi)
        end
      end

    end
  end
=begin
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
=end

=begin
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
=end

  describe "PATCH /users/:public_id" do
    let(:okeysea) { create(:okeysea) }
    let(:takashi) { create(:takashi) }

    context "user not logged in" do

      context "request patch user name" do

        subject! {
          patch api_v1_user_path(okeysea), params: { user: {
            name: "new name"
          } }
        }

        it "is response to 401 UNAUTHORIZED" do
          expect(response).to have_http_status(401)
        end

        it "is respond a message" do
          json = JSON.parse( response.body )
          expect( json.key?("message") ).to eq(true)
        end
      end
    end

    context "user logged in different account" do

      let!(:login) { log_in takashi }

      context "request update valid user params" do
        
        subject! { 
          patch api_v1_user_path(okeysea), params: { user: {
            public_id: "New_ID",
            name: "changed name",
            email: "okeysea_change@example.com",
            password: "changed",
            password_confirmation: "changed"
          } }
        }

        it "is response to 401 UNAUTHORIZED" do
          expect(response).to have_http_status(401)
        end

        it "is unchanged user params" do
          expect(okeysea.reload).to eq(okeysea)
        end
      end
    end

    context "user logged in" do

      let!(:login) { log_in okeysea }

      context "request update valid user params" do
        let!(:update_params) {
          {
            public_id: "New_ID",
            name: "changed name",
            email: "okeysea_change@example.com",
            password: "changed",
            password_confirmation: "changed"
          }
        }
        subject! { 
          patch api_v1_user_path(okeysea), params: {user: update_params} 
        }

        it "is response to 200" do
          expect(response).to have_http_status(200)
        end

        it "is unchanged public_id" do
          expect(okeysea.reload.public_id).to eq(okeysea.public_id)
        end

        it "is changed name" do
          expect(okeysea.reload.name).to eq(update_params[:name])
        end

        xit "is changed email" do
          expect(okeysea.reload.email).to eq(update_params[:email])
        end

        it "is changed password" do
          expect(okeysea.reload.authenticate(update_params[:password])).to be_truthy
        end

        it "is respond updated user detail inform" do
          json = JSON.parse( response.body )
          expect( json.slice("public_id","display_id","name","email","activated") ).to eq(okeysea.reload.slice(%i[public_id display_id name email activated]))
          expect( json ).to eq(okeysea.reload.api_details)
          expect( json ).not_to eq(okeysea.reload)
        end
      end

      context "request update invalid user params" do
        let!(:update_params) {
          {
            public_id: "",
            name: "",
            email: "",
            password: "abc",
            password_confirmation: ""
          }
        }
        subject! { 
          patch api_v1_user_path(okeysea), params: {user: update_params} 
        }

        it "is response to 422 UNPROCESSABLE ENTITY" do
          expect(response).to have_http_status(422)
        end

        it "is unchanged user params" do
          expect(okeysea.reload).to eq(okeysea)
        end

        it "is respond message and errors" do
          json = JSON.parse( response.body )
          expect( json.key?("message") ).to eq(true)
          expect( json.key?("errors") ).to eq(true)
        end
      end
    end
  end

=begin
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
=end
end
