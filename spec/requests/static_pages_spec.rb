require 'rails_helper'

RSpec.describe "StaticPages", type: :request do

  describe "GET /static_pages/home" do
    it "works! status 200" do
      get static_pages_home_path
      expect(response).to have_http_status(200)
    end
  end

  describe "GET /static_pages/help" do
    it "works! status 200" do
      get static_pages_help_path
      expect(response).to have_http_status(200)
    end
  end

end
