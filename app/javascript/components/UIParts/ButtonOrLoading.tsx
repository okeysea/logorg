/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

const cssContainer = css({
  width: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

type Props = {
  loading: boolean,
  text?: string,
}

const ButtonOrLoading: React.FC<Props> = props => {
  return (
    <React.Fragment>
      {
        props.loading  && <div css={cssContainer}>
          <div data-scope-path="UIParts/Loading" className="blink_circle" />
        </div>
      }
      { !props.loading && <button>{props.text}</button>}
    </React.Fragment>
  );
}

export default ButtonOrLoading
