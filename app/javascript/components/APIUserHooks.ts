import React, { useState, useCallback, useRef, useEffect } from "react"
import User from "../API/models/User"
import "../API/API"

let user: User = new User();

export function useAPIUser(userId: string = null):
[
  boolean, User
]{

  const [loaded, setLoaded] = useState( false );

  useEffect(()=>{
    if( userId ){
      window.API.User.getByPublicId(userId).then(result=>{
        if( result.isSuccess() ){
          user = result.value;
          setLoaded( true );
        }else{
          //TODO: error process
        }
      })
    }else{
      setLoaded( true );
    }
  },[])

  return [loaded, user]
}
