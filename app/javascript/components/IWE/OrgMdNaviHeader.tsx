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
  position: "relative",
  display: "inline-block",
  padding: "0.5em 1em",
  textDecoration: "none",
  background: "transparent",
  transition: "background-color 0.2s",
  color: "#f9f9fa",
  borderRadius: "3px",
  cursor: "pointer",

  "&:hover":{
    background: "#2a8fd6",
  },
});

type Props = {
  onSave: ()=>void
}

const OrgMdNaviHeader: React.FC<Props> = props => {

  const handleClickSave = () => {
    props.onSave();
  };

  return (
    <nav css={cssNaviHeader}>
      <div css={cssLogoContainer}>
        <Icon icon="LogOrg" />
      </div>
      <div css={cssControllsContainer}>
        <div css={cssSaveButtonContainer}>
          <a css={cssSaveButton} onClick={handleClickSave}>サーバーへ送信</a>
        </div>
      </div>
    </nav>
  );
}

export default OrgMdNaviHeader
