export type typedFetchResponse<T> = {
    status: number,
    ok: boolean,
    data:T,
    response: Response
}

const wrap = <T>(
  task: Promise<Response>
): Promise<typedFetchResponse<T>> => {
  return new Promise((resolve, reject) => {
    task
      .then( response => {
        response
          .json()
          .then(json => {
            resolve( {
              status: response.status,
              ok: response.ok,
              data: json,
              response: response
            } )
          })
          .catch( error => {
            reject(error)
          })
      }).catch(error => {
        reject(error);
      })
  })
}

const typedFetch = <T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<typedFetchResponse<T>> => {
  return wrap<T>(fetch(input, init))
}

export default typedFetch
