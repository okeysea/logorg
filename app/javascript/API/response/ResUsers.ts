import ResUser, {isResUser} from "./ResUser"

type ResUsers = Array<ResUser>

export function isResUsers(arg: any): arg is ResUsers {
  return arg instanceof Array &&
         arg.length == 0 ||
         isResUser(arg[0]);
}

export default ResUsers;
