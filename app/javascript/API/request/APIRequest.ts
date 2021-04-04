import typedFetch, { typedFetchResponse } from "./typedFetch"
interface wrapFormData extends FormData {
  append( name: string, value: string | Blob, filename?: string): any
}


export default class APIRequest {

  private api_version:  number
  private api_protocol: string
  private api_host:     string

  constructor(
    version: number  = 1,
    protocol: string = location.protocol,
    hostname: string = location.host
  ) {
    this.api_version  = version
    this.api_protocol = protocol;
    this.api_host     = hostname;
  }

  getURLBase(): string {
    return this.api_protocol + "//" + this.api_host + "/api/v" + this.api_version + "/";
  }

  getCSRFToken(): string {
    return document.getElementsByName("csrf-token").item(0)["content"]
  }

  getRequest(
       url: string,
    method: any,
      body?: FormData
  ): Request;
  getRequest(
       url: string,
    method: any,
      body?: { [key: string]: any }
  ): Request;
  getRequest(
       url: string,
    method: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "TRACE" = "GET",
      body?: any
  ): Request {
    if( body == undefined ) body = {};

    if( method != "GET" && method != "HEAD" ){

      // リクエストボディー生成
      let reqBody = null;
      if( body instanceof FormData ){
        reqBody = body
      }else{
        reqBody = this.generateObjectToFormData(body);
      }

      const requestURL = new URL( url, this.getURLBase() );
      return new Request(requestURL.toString(),
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
      // クエリ付き URL 生成
      const requestURL = new URL( url, this.getURLBase() );
      Object.keys(body).forEach( key => requestURL.searchParams.append(key, body[key]) );

      return new Request(requestURL.toString(),
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

  execute<T>(
       url: string,
    method: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "TRACE",
      body?: {[key:string]:any},
  ): Promise<typedFetchResponse<T>>;
  execute<T>(
       url: string,
    method = "GET",
      body?: any
  ): Promise<typedFetchResponse<T>> {
    if( body instanceof FormData ){
      if( method != "GET" && method != "HEAD" ){
        return typedFetch<T>( this.getRequest( url, method, body ) );
      }
    }else{
      return typedFetch<T>( this.getRequest( url, method, body ) );
    }
  }

  // javascript オブジェクトをFormDataに変換
  // その際キー名をいいかんじに変換する。(PHP方式)
  // ネストにも対応している
  //
  //   INPUT                || OUTPUT
  //   key: string          => key = string
  //   key: Array[1,2]      => key[] = 1, key[] = 2
  //   key: { obj: string } => key[obj] = string
  //
  // TODO: Blobへの対応/もっとロジックを整理できそう
  private generateObjectToFormData(object: any): FormData {

    const formdata = new FormData() as wrapFormData;
    const recursive = (obj, keyformat = "<%%KEYNAME%%><%%KEYATTR%%>") => {

      const getKeyName = ( keyname: string, keyattr: string, last = "" ) => {
        return keyformat.replace("<%%KEYNAME%%>", keyname)
                .replace("<%%KEYATTR%%>", keyattr) + last;
      };

      if( obj === undefined || obj === null ) return;

      if(typeof obj === "string"){
        keyformat = keyformat.replace("[<%%KEYNAME%%>]", "");
        formdata.append( getKeyName("",""), obj );
      }else if( obj instanceof Array ){
        keyformat = keyformat.replace("[<%%KEYNAME%%]", "");
        const keyname = getKeyName("", "[]", "[<%%KEYNAME%%]<%%KEYATTR%%>");
        obj.forEach( value => { recursive( value, keyname ) } );
      }else{
        console.log( obj );
        Object.keys(obj).forEach( key =>{ recursive(obj[key], getKeyName(key, "[<%%KEYNAME%%>]", "<%%KEYATTR%%>")) } );
      }
    };

    recursive(object);
    return formdata;
  }
}

