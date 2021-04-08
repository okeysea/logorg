/** @jsx jsx */
import { jsx, css } from "@emotion/react"

import * as React from "react"
import { useState, useRef, useEffect } from "react"

const cssOverlay = css({
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

type Props = {
};

const Modal: React.FC<Props> = props => {
  return (
    <div></div>
  );
};

export default Modal
