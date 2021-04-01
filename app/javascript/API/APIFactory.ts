import Result, { Success, Failure } from "./Result"
import APIError from "./APIError"
import APIUsers from "./request/APIUsers"
import APIPosts from "./request/APIPosts"
import User from "./models/User"
import Post from "./models/Post"

export default class APIFactory {
  constructor() {
  }

  get User(){
    return UserAPIWrapper;
  }

  get Post(){
    return PostAPIWrapper;
  }
}

const UserAPI = new APIUsers();
const UserAPIWrapper = {
  new: () => {
    return new User();
  },

  all: async () => {
    return await UserAPI.index();
  },

  getByPublicId: async (pub_id: string) => {
    return await UserAPI.show( pub_id );
  },
};

const PostAPI = new APIPosts();
const PostAPIWrapper = {
  new: () => {
    return new Post();
  },

  getByPostId: async (post_id: string) => {
    return await PostAPI.show( post_id );
  },
}
