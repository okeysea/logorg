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
    context "invalid login information" do
      it "is failed login and redirect to root_path" do
        post login_path, params: { session: {
          public_id: '',
          password: ''
        } }
        expect(response).to redirect_to(root_path)
      end
    end
  end
end
