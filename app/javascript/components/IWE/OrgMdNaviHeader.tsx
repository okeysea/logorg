/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import Icon from "./UIParts/Icon"

const cssNaviHeader = css({
  boxSizing: "border-box",
  height: "34px",
  backgroundColor: "#282c37",
  color: "#fff",

  display: "flex",
});

const cssLogoContainer = css({
  width: "34px",
  height: "34px",
  backgroundColor: "#2b90d9",
  fontSize: "26px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const cssControllsContainer = css({
  width: "100%",
  display: "flex",
  alignItems: "center",
});

const cssSaveButtonContainer = css({
  marginLeft: "auto",
});

const cssSaveButton = css({
  transition: "background-color 0.2s",
  border: "1px solid #f9f9fa",
  color: "#f9f9fa",
  borderRadius: "3px",
  background: "transparent",
});

type Props = {
  onSave: ()=>void
}

const OrgMdNaviHeader: React.FC<Props> = props => {
  return (
    <nav css={cssNaviHeader}>
      <div css={cssLogoContainer}>
        <Icon icon="LogOrg" />
      </div>
      <div css={cssControllsContainer}>
        <div css={cssSaveButtonContainer}>
          <button css={cssSaveButton} onClick={props.onSave}>Save!</button>
        </div>
      </div>
    </nav>
  );
}

export default OrgMdNaviHeader
