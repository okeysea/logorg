class PostsController < ApplicationController
  before_action :set_post,          only: %i[show edit update destroy]
  before_action :logged_in_user,    only: %i[edit update destroy new create]
  before_action :require_ownership, only: %i[edit update destroy]

  # GET /posts
  # GET /posts.json
  # 誰でもみれる
  def index
    @posts = Post.all
  end

  # GET /posts/1
  # GET /posts/1.json
  # 誰でもみれる
  def show
  end

  # GET /posts/new
  # ログインしているユーザーかつそのユーザー
  def new
    @post = Post.new
  end

  # GET /posts/1/edit
  # ログインしているユーザーかつ記事のオーナー
  def edit
  end

  # POST /posts
  # POST /posts.json
  # ログインしてるユーザーかつそのユーザー
  def create
    @post = Post.new(post_params)

    respond_to do |format|
      if @post.save
        format.html { redirect_to @post }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  # ログインしているユーザーかつ記事のオーナー
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1
  # DELETE /posts/1.json
  # ログインしているユーザーかつ記事のオーナー
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_to posts_url }
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
      params.require(:post).permit(:user_id, :title, :content, :content_source)
    end
end
