import APIPosts from "../request/APIPosts"
import ResPost from "../response/ResPost"
import User from "../models/User"

export default class Post {
  private postData: ResPost;
  private request: APIPosts;
  private serverExists: boolean;

  isPost(): this is Post {
    return true;
  }

  constructor();
  constructor( post: Post );
  constructor( post: ResPost );
  constructor( obj?: any ) {
    this.request = new APIPosts();
    if( obj == null ){
      this.postData = {
        post_id: "",
        title: "",
        content_source: "",
        content: "",
        created_at: "",
        updated_at: "",
        owner: null,
      }
    }else if( obj instanceof Post ){
      this.postData = {
        post_id: obj.postId,
        title: obj.title,
        content_source: obj.contentSource,
        content: obj.content,
        created_at: obj.createdAt,
        updated_at: obj.updatedAt,
        owner: obj.owner,
      }
    }else{
      this.postData = obj;
    }
  }

  get postId(): string            { return this.postData.post_id; }
  get title(): string             { return this.postData.title; }
  get contentSource(): string     { return this.postData.content_source; }
  get content(): string           { return this.postData.content; }
  get createdAt(): string         { return this.postData.created_at; }
  get createdAtDate(): Date       { return new Date( this.createdAt ); }
  get updatedAt(): string         { return this.postData.updated_at; }
  get updatedAtDate(): Date       { return new Date( this.updatedAt ); }
  get owner()                     { return this.postData.owner; }
  get ownerUser()                 { return new User( this.owner ) }

  set title(value: string)          { this.postData.title = value; }
  set contentSource(value: string)  { this.postData.content_source = value; }

  async update(){
    return await this.request.update(this.postId, {
      title: this.title,
      content_source: this.contentSource,
    });
  }

  async create(){
    return await this.request.create({
      title: this.title,
      content_source: this.contentSource,
    });
  }

  async createOrUpdate(){
    if( this.postId ){
      return await this.update();
    }else{
      return await this.create();
    }
  }
}
