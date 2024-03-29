class PostsController < ApplicationController
  before_action :set_post,          only: %i[show edit update destroy]
  before_action :logged_in_user,    only: %i[edit update destroy new create]
  before_action :require_ownership, only: %i[edit update destroy]

  # GET /posts
  # GET /posts.json
  # 誰でもみれる
  def index
    @user = User.find_by(public_id: params[:user_public_id].downcase)
    @posts = Post.eager_load(:user)
      .where(user_id: @user.id)
      .search_query(**post_search_query)
      .page(params[:page])
      .per(10)
    @keyword = post_search_query[:keyword]
  end

  def global_index
    @posts = Post.eager_load(:user)
      .search_query(**post_search_query)
      .page(params[:page])
      .per(10)
    @keyword = post_search_query[:keyword]
  end

  # GET /posts/1
  # GET /posts/1.json
  # 誰でもみれる
  def show
    redirect_to user_post_path(@post.user, @post) unless @post.user.display_id.eql?(params[:user_public_id])
  end

  # GET /posts/new
  # ログインしているユーザーかつそのユーザー
  def new
    @user = User.find_by(public_id: params[:user_public_id].downcase)
    redirect_to new_user_post_url(current_user) unless current_user?(@user)
    @post = Post.new
    render 'new', layout: 'non-header-footer-layout'
  end

  # GET /posts/1/edit
  # ログインしているユーザーかつ記事のオーナー
  def edit
    render 'edit', layout: 'non-header-footer-layout'
  end

  # POST /posts
  # POST /posts.json
  # ログインしてるユーザーかつそのユーザー
  # def create
  #   @post = Post.new(post_params)
  #   @post.user_id = current_user.id

  #   respond_to do |format|
  #     if @post.save
  #       format.html { redirect_to user_post_url(@post.user, @post) }
  #       format.json { render :show, status: :created, location: @post }
  #     else
  #       format.html { render :new }
  #       format.json { render json: @post.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # PATCH/PUT /posts/1
  # PATCH/PUT /posts/1.json
  # ログインしているユーザーかつ記事のオーナー
  # def update
  #   respond_to do |format|
  #     if @post.update(post_params)
  #       format.html { redirect_to user_post_path(@post.user, @post) }
  #       format.json { render :show, status: :ok, location: user_post_path(@post.user, @post) }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @post.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # DELETE /posts/1
  # DELETE /posts/1.json
  # ログインしているユーザーかつ記事のオーナー
  def destroy

    if @post.user.is_only_review?
      flash_message(:notice, "評価用アカウントの記事の削除はできません")
      respond_to do |format|
        format.html { redirect_to user_posts_url }
        format.json { head :no_content }
      end
    else
      @post.destroy
      respond_to do |format|
        format.html { redirect_to user_posts_url }
        format.json { head :no_content }
      end
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

    def post_search_query
      {keyword: params[:q], order_by: params[:b], order: params[:o]}
    end

end
