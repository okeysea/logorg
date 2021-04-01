import Result, { Success, Failure } from "../Result"
import {typedFetchResponse} from "./typedFetch"
import APIRequest from "./APIRequest"
import APIStatus from "./APIStatus"

type statusProcs<S,F> = {[key:number]:(response:typedFetchResponse<S>)=> Success<S, F> | Failure<S,F>};

export default class APIBase {
  private request: APIRequest;

  constructor() {
    this.request = new APIRequest();
  }

  protected async apiBase<S,F>(
    parameters: {
      path: string,
      method: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "TRACE",
      param?: any
      proc?: statusProcs<S, F>
    }

  ):Promise<Result<S,F>>{

    const response = await this.request.execute<S>(parameters.path, parameters.method, parameters.param)
      .then(response=>{
        if( parameters.proc[response.status] !== undefined ) {
          return parameters.proc[response.status](response);
        }else if( parameters.proc[APIStatus.Other] !== undefined ){
          return parameters.proc[APIStatus.Other](response);
        }else{
          throw new Error("HTTP Status handler not found.");
        }
      }).catch(error =>{ throw new Error(error); } );

    return response;
    
  }

}
