const APIStatus = {
  // Informational
  Continue:                     100,
  SwitchingProtocols:           101,
  Processing:                   102,

  // Success
  OK:                           200,
  Created:                      201,
  Accepted:                     202,
  NonAuthoritativeInformation:  203,
 	NoContent:                    204,
 	ResetContent:                 205,
  PartialContent:               206,
  MultiStatus:                  207,
  IMUsed:                       226,

  // Redirection
  MultipleChoices:              300,
  MovedPermanently:             301,
  Found:                        302,
  SeeOther:                     303,
  NotModified:                  304,
  UseProxy:                     305,
  TemporaryRedirect:            307,

  // Client Error
  BadRequest:                   400,
  Unauthorized:                 401,
  PaymentRequired:              402,
  Forbidden:                    403,
  NotFound:                     404,
  MethodNotAllowed:             405,
  NotAcceptable:                406,
  ProxyAuthenticationRequired:  407,
  RequestTimeout:               408,
  Conflict:                     409,
  Gone:                         410,
  LengthRequired:               411,
  PreconditionFailed:           412,
  RequestEntityTooLarge:        413,
  RequestURITooLong:            414,
  UnsupportedMediaType:         415,
  RequestedRangeNotSatisfiable: 416,
  ExpectationFailed:            417,
  UnprocessableEntity:          422,
  Locked:                       423,
  FailedDependency:             424,
  UpgradeRequired:              426,

  // Server Error
  InternalServerError:          500,
  NotImplemented:               501,
  BadGateway:                   502,
  ServiceUnavailable:           503,
  GatewayTimeout:               504,
  HTTPVersionNotSupported:      505,
  InsufficientStorage:          507,
  NotExtended:                  510,

  // custom state
  Other:                        999,
} as const;

export default APIStatus;
