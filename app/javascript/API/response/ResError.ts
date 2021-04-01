export type ResErrorMessage = {
  format: "message"
  message: string
}

export function isResErrorMessage(arg: any): arg is ResErrorMessage {
  return arg.format === "message";
}

export type ResErrorModel = {
  format: "error_model"
  message: string
  errors: [
    {
      resource: string
      field: string
      messages: [ string ]
    }
  ]
}

export function isResErrorModel(arg: any): arg is ResErrorModel {
  return arg.format === "error_model";
}

type ResError = ResErrorMessage | ResErrorModel

export function isResError(arg: any): arg is ResError {
  return isResErrorMessage(arg) || isResErrorModel(arg);
}

export const ErrorType = {
  isResErrorMessage,
  isResErrorModel,
  isResError
}

export default ResError
