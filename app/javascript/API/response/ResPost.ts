import ResUser from "./ResUser"

type ResPost = {
  post_id: string
  title: string
  content_source: string
  readonly content: string
  readonly created_at: string
  readonly updated_at: string
  readonly owner: ResUser | null
  urls: {
    [key:string]: string
  }
};

export function isResPost(arg: any): arg is ResPost {
  return arg.post_id !== undefined &&
         arg.title !== undefined &&
         arg.content_source !== undefined;
}

export default ResPost;
