import APIUsers from "../request/APIUsers"
import ResUser from "../response/ResUser"

export default class User {
  private userData: ResUser;
  private request: APIUsers;
  private userPassword: string;
  private userPasswordConfirmation: string;
  private userAvatarDataUri: string;

  isUser(): this is User {
    return true;
  }

  constructor();
  constructor( user: User );
  constructor( user: ResUser );
  constructor( obj?: any ) {
    this.request = new APIUsers();
    if( obj == null ){
      this.userData = {
        public_id: "",
        display_id: "",
        name: "",
        avatar:{
        }
      }
    }else if( obj instanceof User ){
      this.userData = {
        public_id: obj.publicId,
        display_id: obj.displayId,
        name: obj.name,
        avatar: obj.avatars,
      }
    }else{
      this.userData = obj;
    }
    this.userPassword = "";
    this.userPasswordConfirmation = "";
    this.userAvatarDataUri = "";
  }

  get publicId(): string    { return this.userData.public_id; }
  get displayId(): string   { return this.userData.display_id; }
  get name(): string        { return this.userData.name; }
  get email(): string       { return this.userData.email; }
  get activated(): boolean  { return this.userData.activated; }
  get avatarDataUri(): string { return this.userAvatarDataUri; }
  get avatars(): any        { return this.userData.avatar; }

  set publicId(value: string)   { this.userData.public_id = value; }
  set displayId(value: string)  { this.userData.display_id = value; }
  set name(value: string)       { this.userData.name = value; }
  set email(value: string)      { this.userData.email = value; }
  set password(value: string)   { this.userPassword = value; }
  set passwordConfirmation(value: string) { this.userPasswordConfirmation = value; }
  set avatarDataUri(value: string){ this.userAvatarDataUri = value; }

  getAvatar(version = "raw") {
    if( this.userData.avatar[version] ){
      return this.userData.avatar[version];
    }
    return null;
  }

  async update(){
    return await this.request.update(this.publicId, {
      name:                   this.name,
      password:               this.userPassword,
      password_confirmation:  this.userPasswordConfirmation,
      avatar_data_uri:        this.avatarDataUri,
    });

  }
}
