/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

const cssNaviHeader = css({
  boxSizing: "border-box",
  height: "34px",
  backgroundColor: "#282c37",
});

type Props = {
}

const OrgMdNaviHeader: React.FC<Props> = props => {
  return (
    <nav css={cssNaviHeader}></nav>
  );
}

export default OrgMdNaviHeader
