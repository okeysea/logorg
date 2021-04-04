import Result, { Success, Failure } from "../Result"
import User from "../models/User"
import Users, {isUsers} from "../models/Users"
import ResErrorMessage, { isResErrorMessage } from "../response/ResErrorMessage"
import APIError from "../APIError"
import APIStatus from "./APIStatus"
import APIBase from "./APIBase"


export type UserCreateParams = {
  public_id:              string,
  name:                   string,
  email:                  string,
  password:               string,
  password_confirmation:  string,
  avatar_data_uri?:       string,
};

export type UserUpdateParams = {
  name?:                  string,
  password?:              string,
  password_confirmation?: string,
  avatar_data_uri?:       string,
};

export default class APIUsers extends APIBase {
  constructor() {
    super();
  }

  async index(): Promise<Result<Users, APIError>>{

    return await this.apiBase<Users, APIError>(
      {
        path: "users/",
        method: "GET",
        proc: {
          [APIStatus.OK]: (response)=>{
            return new Success(response.data.reduce<Users>((value, current)=>{
              value.push( new User(current) );
              return value;
            },[]));
          },
          [APIStatus.Other]: (response)=>{
            return new Failure( new APIError( response.data ) );
          },
        }
      }
    );

  }

  async show(userId: string): Promise<Result<User, APIError>>{
    return await this.apiBase<User, APIError>(
      {
        path: "users/" + userId,
        method: "GET",
        proc: {
          [APIStatus.OK]: (response)=>{
            return new Success( new User(response.data) );
          },
          [APIStatus.NotFound]: (response)=>{
            return new Failure(new APIError(response.data));
          }
        }
      }
    );
  }
  
  async create(param: UserCreateParams): Promise<Result<User, APIError>>{
    return await this.apiBase<User, APIError>(
      {
        path: "users/",
        method: "POST",
        param: { user: param },
        proc: {
          [APIStatus.Created]: (response)=>{
            return new Success( new User(response.data) );
          },
          [APIStatus.UnprocessableEntity]: (response)=>{
            return new Failure( new APIError( response.data ) );
          }
        }
      }
    );
  }

  async update(userId: string, param: UserUpdateParams): Promise<Result<User, APIError>>{
    
    return await this.apiBase<User, APIError>(
      {
        path: "users/" + userId,
        method: "PUT",
        param: { user: param },
        proc: {
          [APIStatus.OK]: (response)=>{
            return new Success( new User(response.data) );
          },
          [APIStatus.UnprocessableEntity]: (response)=>{
            return new Failure( new APIError( response.data ) );
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
