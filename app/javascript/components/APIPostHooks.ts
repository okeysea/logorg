import React, { useState, useCallback, useRef, useEffect } from "react"
import Post from "../API/models/Post"
import "../API/API"

let post: Post;

export function useAPIPost(postId: string | undefined):
[
  boolean, Post
]{

  const [loaded, setLoaded] = useState( false );

  useEffect(()=>{
    if( postId === undefined ){
      post = window.API.Post.new();
      setLoaded( true );
    }else{
      window.API.Post.getByPostId(postId).then(result=>{
        if( result.isSuccess() ){
          post = result.value;
          setLoaded( true );
        }else{
          //TODO: error process
        }
      })
    }
  },[])

  return [loaded, post]
}
