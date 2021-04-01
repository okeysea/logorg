import User from "./User"

type Users = Array<User>;
export default Users;

export function isUsers(arg: any): arg is Users {
  return arg instanceof Array &&
         arg.length == 0 ||
         arg[0].isUser();
}

