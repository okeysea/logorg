# rubocop:disable all
 require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe "/posts", type: :request do

  before do
    @user = create(:user)
    @okeysea = create(:okeysea)
  end

  let(:valid_attributes) {
    {
      user_id: @user.id,
      title: "タイトル",
      content: "本文",
      content_source: "本文"
    }
  }

  let(:valid_attributes_post) {
    {
      title: "タイトル",
      content: "本文",
      content_source: "本文"
    }
  }

  let(:invalid_attributes) {
    {
      user_id: @user.id,
      title: "タイトル",
      content: nil,
      content_source: nil
    }
  }

  let(:invalid_attributes_post) {
    {
      title: "タイトル",
      content: nil,
      content_source: nil
    }
  }

  describe "GET /index" do
    it "renders a successful response" do
      Post.create! valid_attributes
      get user_posts_url(@user)
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      post = Post.create! valid_attributes
      get user_post_url(@user, post)
      expect(response).to be_successful
    end

    context "different user's post" do
      before do
        @diff_post = Post.create!(user_id: @okeysea.id, title: "title", content: "honbun", content_source: "honbun")
      end

      it "is redirect to correct user url" do
        get user_post_url(@user, @diff_post)
        expect(response).to redirect_to(user_post_url(@okeysea, @diff_post))
      end
    end
  end

  describe "GET /new" do
    context "user logged in" do
      before do
        log_in @user
      end

      it "renders a successful response" do
        get new_user_post_url(@user)
        expect(response).to be_successful
      end
    end

    context "user logged in different user" do
      before do
        log_in @okeysea
      end

      it "is redirect to logged in user's new_user_post_url" do
        get new_user_post_url(@user)
        expect(response).to redirect_to(new_user_post_url(@okeysea))
      end
    end

    context "user not logged in" do
      it "redirect to root_path" do
        get new_user_post_url(@user)
        expect(response).to redirect_to(login_path)
      end
    end
  end

  describe "GET /edit" do
    context "user logged in" do

      before do
        log_in @user
      end

      it "render a successful response" do
        post = Post.create! valid_attributes
        p edit_user_post_url(@user, post)
        get edit_user_post_url(@user, post)
        expect(response).to be_successful
      end
    end
  end

  describe "POST /create" do
    context "user logged in" do
      before do
        log_in @user
      end

      context "with valid parameters" do
        it "creates a new Post" do
          expect {
            post user_posts_url(@user), params: { post: valid_attributes_post }
          }.to change(Post, :count).by(1)
        end

        it "redirects to the created post" do
          post user_posts_url(@user), params: { post: valid_attributes_post }
          expect(response).to redirect_to(user_post_url(Post.last.user, Post.last))
        end
      end

      context "with invalid parameters" do
        it "does not create a new Post" do
          expect {
            post user_posts_url(@user), params: { post: invalid_attributes_post }
          }.to change(Post, :count).by(0)
        end

        it "renders a successful response" do
          post user_posts_url(@user), params: { post: invalid_attributes_post }
          expect(response).to be_successful
        end
      end
    end

    context "user not logged in" do
      context "with valid parameters" do
        it "does not create a new Post" do
          expect {
            post user_posts_url(@user), params: { post: valid_attributes_post }
          }.to change(Post, :count).by(0)
        end

        it "redirects to login_path" do
          post user_posts_url(@user), params: { post: valid_attributes_post }
          expect(response).to redirect_to(login_path)
        end
      end
    end
  end

  describe "PATCH /update" do
    context "user logged in" do
      before do
        log_in @user
      end
      context "with valid parameters" do
        let(:new_attributes) {
          {
            title: "更新タイトル",
            content: "更新本文",
            content_source: "更新本文"
          }
        }

        it "updates the requested post" do
          post = Post.create! valid_attributes
          patch user_post_url(post.user, post), params: { post: new_attributes }
          post.reload
        end

        it "redirects to the post" do
          post = Post.create! valid_attributes
          patch user_post_url(post.user, post), params: { post: new_attributes }
          post.reload
          expect(response).to redirect_to(user_post_url(post.user, post))
        end
      end

      context "with invalid parameters" do
        it "renders a successful response (i.e. to display the 'edit' template)" do
          post = Post.create! valid_attributes
          patch user_post_url(post.user, post), params: { post: invalid_attributes_post }
          expect(response).to be_successful
        end
      end
    end
  end

  describe "DELETE /destroy" do
    context "user logged in" do
      before do
        log_in @user
      end
      it "destroys the requested post" do
        post = Post.create! valid_attributes
        expect {
          delete user_post_url(post.user, post)
        }.to change(Post, :count).by(-1)
      end

      it "redirects to the posts list" do
        post = Post.create! valid_attributes
        delete user_post_url(post.user, post)
        expect(response).to redirect_to(user_posts_url)
      end
    end
  end
end
