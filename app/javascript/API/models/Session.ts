import APISessions from "../request/APISessions"

export default class Session {
  private request: APISessions;
  constructor(){
    this.request = new APISessions();
  }

  async logout(){
    return this.request.destroy();
  }
}
