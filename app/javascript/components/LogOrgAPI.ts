export interface APIUser {
  public_id:  string
  display_id: string
  name:       string
}

export interface APIPost {
  post_id:             string,
  title:          string,
  content:        string,
  content_source: string,
}

declare global {
  interface Window {
    gon: {
      loggedIn: boolean,
      user?: APIUser,
    }
  }
}

interface wrapFormData extends FormData {
  append( name: string, value: string | Blob, filename?: string): any
}

export class Post implements APIPost{
  private request: APIRequest;
  private flagNew: boolean;

  post_id:         string;
  title:           string;
  content:         string;
  content_source:  string;

  constructor(req: APIRequest, post_id?: string) {
    this.request = req;
    this.post_id = post_id;
    this.flagNew = false;

    if( post_id == undefined ){
      this.flagNew = true;
    }else{
      this.request.getPost(this).then( res=>{
        this.post_id = res.post_id;
        this.title = res.title;
        this.content = res.content;
        this.content_source = res.content_source;
      }).catch();
    }
  }

  setTitle(value: string){
    this.title = value;
  }

  setContent(value: string){
    this.content = value;
    this.content_source = value;
  }

  async sync(): Promise<Post>{
    try {
      const res = await this.request.getPost(this);
      this.post_id        = res.post_id;
      this.title          = res.title;
      this.content        = res.content;
      this.content_source = res.content_source;
    } catch (err) {
    }
    return this;
  }

  update(){
    this.request.updatePost(this);
  }
}

class APIRequest {
  private api_user     : APIUser;
  private api_protocol : string;
  private api_host     : string;

  constructor(
    user: APIUser    = window.gon.user,
    protocol: string = location.protocol,
    hostname: string = location.host
  ) {
    if( user == undefined ) {
      user = {
        public_id:  "guest",
        display_id: "Guest",
        name:       "Guest",
      }
    }
    this.api_user     = user;
    this.api_protocol = protocol;
    this.api_host     = hostname;
  }

  urlHelperUser(user: APIUser){
    return "users/" + user.public_id;
  }

  urlHelperPost(post: APIPost) {
    return "posts/" + post.post_id;
  }

  urlHelperHost(): string {
    return this.api_protocol + "//" + this.api_host;
  }

  urlHelperPostPath(user: APIUser, post: APIPost): string {
    return this.urlHelperHost() + "/" + this.urlHelperUser(user) + "/" + this.urlHelperPost(post);
  }

  getCSRFToken(): string {
    return document.getElementsByName("csrf-token").item(0)["content"]
  }
  
  getRequest(
       url: string,
    method: "get" | "head" | "post" | "options" | "put" | "delete" | "trace" = "get",
      body: any = {}
  ): Request {

    if( method != "get" && method != "head" ){
      let reqBody = new FormData() as wrapFormData;
      Object.keys(body).forEach( key => reqBody.append(key, body[key]) );
    
      return new Request(url,
       {
         method: method,
         credentials: "same-origin",
         headers: {
           "X-CSRF-Token": this.getCSRFToken(),
           "X-Requested-With": "XMLHttpRequest"
         },
         body: reqBody
       }
      );
    }else{
      return new Request(url,
       {
         method: method,
         credentials: "same-origin",
         headers: {
           "X-CSRF-Token": this.getCSRFToken(),
           "X-Requested-With": "XMLHttpRequest"
         },
       }
      );
    }
  }

  async updatePost(post: APIPost): Promise<APIPost> {
    const res = await fetch(
      this.getRequest(
        this.urlHelperPostPath(this.api_user, post) + ".json", "post",
        {
          "_method":        "patch",
          "post[title]":    post.title,
          "post[content]":  post.content,
          "post[content_source]": post.content_source
        }
      )
    );

    if( !res.ok ){
      throw new Error("http error");
    }else{
      const json = await res.json();
      const ret: APIPost = {
        post_id:        json.post_id,
        title:          json.title,
        content:        json.content,
        content_source: json.content_source,
      }
      return ret;
    }
  }

  async getPost(post: APIPost): Promise<APIPost> {
    const res = await fetch( 
      this.getRequest( this.urlHelperPostPath(this.api_user, post) + ".json", "get", {} )
    );
     
    if( !res.ok ){
      throw new Error("http error");
    }else{
      const json = await res.json();
      const ret: APIPost = {
        post_id:        json.post_id,
        title:          json.title,
        content:        json.content,
        content_source: json.content_source,
      }
      return ret;
    }
  }
}

export default class LogOrgAPI {
  private api_request: APIRequest;

  constructor() {
    this.api_request = new APIRequest();
  }

  loggedIn(): boolean {
    return window.gon.loggedIn;
  }

  factoryNewPost(): Post{
    return new Post(this.api_request);
  }

  factoryPost(post_id: string): Post{
    return new Post(this.api_request, post_id);
  }
}
