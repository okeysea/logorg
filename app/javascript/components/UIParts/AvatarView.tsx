/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

type Props = {
  imgUri: string
}

const AvatarView: React.FC<Props> = props =>{

  return (
    <div>
      <img src={props.imgUri} />
    </div>
  );

}

export default AvatarView;
