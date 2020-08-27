# rubocop:disable all
require 'rails_helper'

RSpec.describe Post, type: :model do

  let(:user) { create(:user) }

  let(:params) { {
    user_id:        user_id,
    title:          title,
    content:        content,
    content_source: content_source
  } }

  let(:user_id){ user.id }
  let(:title){ "タイトル" }
  let(:content){ "本文" }
  let(:content_source){ "本文" }

  let(:post){ Post.create params }

  describe "create" do
    context "valid params" do
      it "is valid" do
        expect(post.valid?).to eq(true)
      end
    end

    context "invalid user" do
      let(:user_id){ 0 }
      it "is invalid" do
        expect(post.valid?).to eq(false)
      end
    end
  end
end
