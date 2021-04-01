import Result, { Success, Failure } from "../Result"
import Post from "../models/Post"
import ResErrorMessage, { isResErrorMessage } from "../response/ResErrorMessage"
import APIError from "../APIError"
import APIStatus from "./APIStatus"
import APIBase from "./APIBase"


export type PostCreateParams = {
  title?: string,
  content_source?: string,
};

export type PostUpdateParams = {
  title?: string,
  content_source?: string,
};

export default class APIPosts extends APIBase {
  constructor() {
    super();
  }

  async show(postId: string): Promise<Result<Post, ResErrorMessage>>{
    return await this.apiBase<Post, ResErrorMessage>(
      {
        path: "posts/" + postId,
        method: "GET",
        proc: {
          [APIStatus.OK]: (response)=>{
            return new Success( new Post(response.data) );
          },
          [APIStatus.NotFound]: (response)=>{
            return new Failure({message:""});
          }
        }
      }
    );
  }
  
  async create(param: PostCreateParams): Promise<Result<Post, ResErrorMessage>>{
    return await this.apiBase<Post, ResErrorMessage>(
      {
        path: "posts/",
        method: "POST",
        param: { post: param },
        proc: {
          [APIStatus.Created]: (response)=>{
            return new Success( new Post(response.data) );
          },
          [APIStatus.UnprocessableEntity]: (response)=>{
            return new Failure({message:""});
          }
        }
      }
    );
  }

  async update(postId: string, param: PostUpdateParams): Promise<Result<Post, ResErrorMessage>>{
    
    return await this.apiBase<Post, ResErrorMessage>(
      {
        path: "posts/" + postId,
        method: "PUT",
        param: { post: param },
        proc: {
          [APIStatus.OK]: (response)=>{
            return new Success( new Post(response.data) );
          },
          [APIStatus.UnprocessableEntity]: (response)=>{
            return new Failure({message:""});
          }
        }
      }
    );
  }

  /*

  destroy(): boolean{
  }
  */
}
