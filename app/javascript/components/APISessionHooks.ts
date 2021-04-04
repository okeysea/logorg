import React, { useState, useCallback, useRef, useEffect } from "react"
import Session from "../API/models/Session"
import "../API/API"

let session: Session;

export function useAPISession():
[
  Session
]{

  useEffect(()=>{
    session = window.API.Session.get();
  },[])

  return [session];

}
