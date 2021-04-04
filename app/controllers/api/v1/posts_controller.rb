class Api::V1::PostsController < ApplicationController
  include ApiCommonRender

  before_action :set_post,          only: %i[show edit update destroy]
  before_action :logged_in_user,    only: %i[edit update destroy new create]
  before_action :require_ownership, only: %i[edit update destroy]

  # GET /posts
  # GET /posts.json
  # 誰でもみれる
  def index
    @user = User.find_by(public_id: params[:user_public_id].downcase)
    @posts = Post.where(user_id: @user.id).page(params[:page]).per(10)
  end

  # GET /posts/1
  # GET /posts/1.json
  # 誰でもみれる
  def show
    if @post.nil?
      render_not_found message: "Post not found" and return
    else
      render :show and return
    end
  end

  # POST /posts
  # POST /posts.json
  # ログインしてるユーザーかつそのユーザー
  def create
    @post = Post.new(post_params)
    @post.user_id = current_user.id

    if @post.save
      flash_message(:success, "記事を作成しました")
      # redirect_to api_v1_post_path(@post), status: :created and return
      render :show, status: :created, location: api_v1_post_path(@post) and return
    else
      render_error_model @post and return
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  # ログインしているユーザーかつ記事のオーナー
  def update
    if @post.update(post_params)
      flash_message(:success, "記事を更新しました")
      # redirect_to api_v1_post_path(@post), status: :ok and return
      render :show, status: :ok, location: api_v1_post_path(@post) and return
    else
      render_error_model @post and return
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  # ログインしているユーザーかつ記事のオーナー
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to user_posts_url }
      format.json { head :no_content }
    end
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find_by(post_id: params[:id])
    end

    def require_ownership
      redirect_to root_path unless current_user?(@post.user)
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:title, :content, :content_source)
    end
end
