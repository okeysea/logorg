import React, { useState, useCallback, useRef, useEffect } from "react"
import User from "../API/models/User"
import "../API/API"

let user: User = new User();

export function useAPIUser(userId: string):
[
  boolean, User
]{

  const [loaded, setLoaded] = useState( false );

  useEffect(()=>{
    window.API.User.getByPublicId(userId).then(result=>{
      if( result.isSuccess() ){
        user = result.value;
        setLoaded( true );
      }else{
        //TODO: error process
      }
    })
  },[])

  return [loaded, user]
}
