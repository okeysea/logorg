require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  before do
    @okeysea = create(:okeysea)
    @takashi = create(:takashi)
  end
  describe "GET /login" do
    it "is response to 200" do
      get login_path
      expect(response).to have_http_status(200)
    end
  end

  describe "POST /login" do
    context "valid login information" do
      it "is successfully login and redirect to users page" do
        post login_path, params: { session: {
          # リダイレクト先はDisplay_idになるため
          public_id: @okeysea.display_id,
          password: @okeysea.password
        } }
        expect(response).to redirect_to(@okeysea)
      end
    end
    context "empty login information" do
      it "is failed login and response error message" do
        post login_path, params: { session: {
          public_id: '',
          password: ''
        } }
        expect(response.body).to include('danger')
      end
    end
    context "invalid login information" do
      it "is failed login and response error message" do
        post login_path, params: { session: {
          public_id: 'notexistuser',
          password: 'hogehoge'
        } }
        expect(response.body).to include('danger')
      end
    end
  end
end
