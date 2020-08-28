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
      it "is grant post_id" do
        expect(post.post_id).to_not eq(nil)
      end
      it "is duplication post_id does re-grant it" do
        tmp_post = Post.create params
        tmp_post.post_id = 'duplication'
        tmp_post.save

        tmp_post2 = Post.create params
        tmp_post2.post_id = 'duplication'
        tmp_post2.save

        tmp_post3 = Post.create params
        tmp_post3.post_id = 'duplication'
        tmp_post3.save

        expect(tmp_post2.reload.post_id).to_not eq('deplication')
        expect(tmp_post3.reload.post_id).to_not eq('deplication')
        expect(tmp_post2.reload.valid?).to eq(true)
        expect(tmp_post3.reload.valid?).to eq(true)
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
