type ResUser = {
  public_id: string;
  display_id: string;
  name: string;
  email?: string;
  readonly activated?: boolean;
  avatar: {
    [key:string]: string
  },
  urls: {
    [key:string]: string
  },
};

export function isResUser(arg: any): arg is ResUser {
  return arg.public_id !== undefined &&
         arg.display_id !== undefined &&
         arg.name !== undefined;
}

export default ResUser
