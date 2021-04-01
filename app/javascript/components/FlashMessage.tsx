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
});

const cssFlashMessage = css({
  display: "flex",
  justifyContent: "center",
  paddingTop: "8px",
  paddingBottom: "8px",

  "&.notice": {
    backgroundColor: "#ff00ff",
  }
});

const cssFlashMessageBody = css({
  display: "flex",
  justifyContent: "space-between",
  width: "980px",
});

const genFlash = (notifications: Notificates)=>{

  let elements = [];
  for( const msg of notifications ){
    elements.push(
      <div css={cssFlashMessage} className={msg.type}>
        <div css={cssFlashMessageBody}>
          <div>[Inform]</div>
          {msg.message}
          <div>[close]</div>
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

  const appendMessage = (type: any, message: string)=>{
    setMessages([
      ...messages,
      {
        type: "notice",
        message: message,
      }
    ]);
  };

  const [ addObsvEvent, removeObsvEvent ] = useDocumentEventHandler("logorg:dispatchFlash", (e)=>{
    appendMessage("notice", e.detail.message);
  }, [messages]);

  useEffect(()=>{
    addObsvEvent();

    return ()=>{
      removeObsvEvent();
    };

  },[]);

  useEffect(()=>{
    setShowelm(genFlash(messages));
  }, [messages]);

  return (
    <React.Fragment>
      <div css={cssFlashContainer}>
        {showelm}
      </div>
      <button onClick={()=>{dispatchFlash("Dispatched!");}}>Dispatch</button>
    </React.Fragment>
  )
}

export default FlashMessage
