import Result, { Success, Failure } from "../Result"
import User from "../models/User"
import Users, {isUsers} from "../models/Users"
import ResErrorMessage, { isResErrorMessage } from "../response/ResErrorMessage"
import APIError from "../APIError"
import APIStatus from "./APIStatus"
import APIBase from "./APIBase"


export default class APISessions extends APIBase {
  constructor() {
    super();
  }

  /*
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
  }*/

  
  async destroy(): Promise<Result<boolean, boolean>>{
    return await this.apiBase<boolean, boolean>(
      {
        path: "sessions/",
        method: "DELETE",
        proc: {
          [APIStatus.NoContent]: (response)=>{
            return new Success( true );
          },
          [APIStatus.BadRequest]: (response)=>{
            return new Failure( false );
          }
        }
      }
    );
  }
  
}
