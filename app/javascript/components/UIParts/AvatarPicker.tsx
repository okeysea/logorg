/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import AvatarClop from "./AvatarClop"
import AvatarView from "./AvatarView"

type Props = {
  onChange: (uri: string)=>void
}

const AvatarPicker: React.FC<Props> = props =>{

  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState("filepick");
  const [Uri, setUri] = useState("");

  useEffect(()=>{
    if( mode == "view" ){
      props.onChange(Uri);
    }
  },[Uri]);

  const handleFileChange = (event) => {
    const img = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
      if( typeof reader.result == "string" ){
        setMode("clop");
        setUri(reader.result);
      }
    }
  };

  return (
    <div>
      { mode == "filepick" && <input type="file" ref={fileRef} onChange={handleFileChange}/>}
      { mode == "clop" && <AvatarClop imgUri={Uri} onChange={(uri)=>{setUri(uri);setMode("view")}} onCancel={()=>{setMode("filepick")}} width={200} height={200}/> }
      { mode == "view" && <button onClick={()=>{setMode("filepick")}}>変更</button>}
      { mode == "view" && <AvatarView imgUri={Uri} />}
    </div>
  );

}

export default AvatarPicker;
