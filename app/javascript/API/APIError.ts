import ResError, {ErrorType} from "./response/ResError"

export default class APIError extends Error {
  public level: string
  public message: string
  public date: Date
  public format: string
  public rawError: ResError

  private errorsForForm: { [key:string]: { [key:string]: [string] }} | null

  constructor( error: any, ...params){
    super( ...params );

    if( Error.captureStackTrace ){
      Error.captureStackTrace(this, APIError);
    }
    //reference: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, APIError.prototype);
    
    this.name = "APIError"
    this.format = error.format
    this.message = error.message
    this.date = new Date();

    if( ErrorType.isResError( error ) ){
      this.rawError = error;
    }else{
      this.rawError = {
        format: "message",
        message: "[unknown error]\n" + JSON.stringify(error, null, 2),
      };
    }
    this.errorsForForm = null;
  }

  public getFormError( resource: string, field: string = null ){

    if( ErrorType.isResErrorModel( this.rawError ) ){

      if( !this.errorsForForm ){
        this.errorsForForm = {};
        this.rawError.errors.forEach((value) => {
          if( !this.errorsForForm[value.resource] ) this.errorsForForm[value.resource] = {};
          this.errorsForForm[value.resource][value.field] = value.messages;
        });
      }

      if( this.errorsForForm[resource] === undefined ) return [];
      if( field === null ) return this.errorsForForm[resource];
      if( this.errorsForForm[resource][field] === undefined ) return [];
      return this.errorsForForm[resource][field];
    }

    return [];
  }

}
