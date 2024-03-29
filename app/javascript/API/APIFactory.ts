import Result, { Success, Failure } from "./Result"
import APIError from "./APIError"
import APIUsers from "./request/APIUsers"
import APIPosts from "./request/APIPosts"
import APISessions from "./request/APISessions"
import APICache from "./APICache"
import User from "./models/User"
import Post from "./models/Post"
import Session from "./models/Session"

export default class APIFactory {
  constructor() {
  }

  get User(){
    return UserAPIWrapper;
  }

  get Post(){
    return PostAPIWrapper;
  }

  get Session(){
    return SessionAPIWrapper;
  }
}

const UserAPICache = new APICache(60000);
const UserAPI = new APIUsers();
const UserAPIWrapper = {
  new: () => {
    return new User();
  },

  all: async () => {
    return await UserAPI.index();
  },

  getByPublicId: async (pub_id: string) => {

    return UserAPICache
      .cache(pub_id)
      .subject(async ()=>{return await UserAPI.show(pub_id); })
      .get();

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

const SessionAPI = new APISessions();
const SessionAPIWrapper = {
  get: () => {
    return new Session();
  },
}
