type ResErrorMessage = {
  message: string,
};

export function isResErrorMessage(arg: any): arg is ResErrorMessage{
  return arg.message !== undefined;
}

export default ResErrorMessage
