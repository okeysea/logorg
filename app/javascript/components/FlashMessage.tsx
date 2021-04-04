/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useEffect } from "react"
import useDocumentEventHandler from "./useDocumentEventHandler"
import {dispatchFlash} from "../Events/FlashMessageEvent"

type Notificate = {
  type: any,
  message: string,
};

type Notificates = Array<Notificate>;

const cssFlashContainer = css({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 1s ease",
});

const cssFlashMessage = css({
  display: "flex",
  height: "38px",
  justifyContent: "center",
  alignContent: "center",
  paddingTop: "8px",
  paddingBottom: "8px",

  "&.notice": {
    backgroundColor: "#f1ccb1",
  },
  "&.success": {
    backgroundColor: "#aee364",
  },
  "&.warning": {
    backgroundColor: "#f5c8cb",
  },
  "&.danger": {
    backgroundColor: "#e25d68",
    color: "#fff",
  },
});

const cssFlashMessageBody = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "980px",
});

const genFlash = (notifications: Notificates)=>{

  let elements = [];
  for( const msg of notifications ){
    elements.push(
      <div css={cssFlashMessage} className={msg.type}>
        <div css={cssFlashMessageBody}>
          <div>[Replace:Icon]</div>
          {msg.message}
          <div>[Replace:close]</div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {elements}
    </React.Fragment>
  );
};

type Props = {
}

const FlashMessage: React.FC<Props> = props => {

  const [ messages, setMessages ] = useState([]);
  const [ showelm, setShowelm ] = useState(<React.Fragment></React.Fragment>);

  const [ addPageEvent, removePageEvent ] = useDocumentEventHandler("turbolinks:visit", (e)=>{
    window.gon.flash = [];
  }, [messages]);

  const appendMessage = (type: any, message: string)=>{
    setMessages([
      ...messages,
      {
        type: type,
        message: message,
      }
    ]);
  };

  const [ addObsvEvent, removeObsvEvent ] = useDocumentEventHandler("logorg:dispatchFlash", (e)=>{
    appendMessage(e.detail.type, e.detail.message);
  }, [messages]);

  useEffect(()=>{
    addObsvEvent();
    addPageEvent();

    return ()=>{
      removeObsvEvent();
      removePageEvent();
    };

  },[]);

  useEffect(()=>{
    setShowelm(genFlash(messages));
  }, [messages]);

  useEffect(()=>{
    window.gon.flash.forEach((value)=>{ value[1].forEach((msg=>appendMessage(value[0], msg))) });
  },[]);

  return (
    <React.Fragment>
      <div css={cssFlashContainer}>
        {showelm}
      </div>
      {/*
      <button onClick={()=>{
        dispatchFlash("Dispatched!");
      }}>Dispatch</button>
      <button onClick={()=>{
        dispatchFlash("Success!", "success");
      }}>Dispatch</button>
      <button onClick={()=>{
        dispatchFlash("warning!", "warning");
      }}>Dispatch</button>
      <button onClick={()=>{
        dispatchFlash("danger!", "danger");
      }}>Dispatch</button>
        */
      }
    </React.Fragment>
  )
}

export default FlashMessage
