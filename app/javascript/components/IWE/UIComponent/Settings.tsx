/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import Accordion from "../UIParts/Accordion"
import Icon from "../UIParts/Icon"

const cssHeader = css({
  minHeight: "34px",
  paddingRight: "12px",
  paddingLeft: "12px",
  borderBottom: "1px solid #d9e1e8",

  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.1)"
  }
});

const cssContent = css({
  borderBottom: "1px solid #d9e1e8",
});

const cssButton = css({
  width: "100%",
  height: "100%",

  "& > *": {
    marginRight: "8px",
  },
});

const cssArrowIcon = css({
  "& .arrow_ico::before": {
    display: "inline-block",
    transform: "scale(0.5, 0.8)",
    transition: "all 0.1s 0s ease",
  },

  "& [aria-expanded=false]": {
    ".arrow_ico::before": {
      transform: "scale(0.5, 0.8) rotate(90deg)"
    },
  },

  "& [aria-expanded=true]": {
    ".arrow_ico::before": {
      transform: "rotate(180deg) scale(0.8, 0.5)"
    },
  },
});

const cssMenuHeader = css({
  paddingLeft: "12px",
  paddingRight: "12px",
  //backgroundColor: "rgba(0,0,0,0.2)",
  borderBottom: "3px solid #d9e1e8",

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const cssMenuTitle = css({
  marginTop: "8px",
  marginBottom: "8px",
});

type Props = {
  className?: string,
}

const Settings: React.FC<Props> = props => {

  return (
    <div className={props.className}>
      <div css={cssMenuHeader}>
        <div css={cssMenuTitle}>設定</div>
      </div>
      <Accordion css={cssArrowIcon}>
        <Accordion.Item>
          <Accordion.Item.Header css={cssHeader}>
            <Accordion.Item.Button css={cssButton}>
              <Icon icon="Arrow" className="arrow_ico" />
              <span>エディタ全般</span>
            </Accordion.Item.Button>
          </Accordion.Item.Header>
          <Accordion.Item.Content css={cssContent}>
            koreha kontentu desu
          </Accordion.Item.Content>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Item.Header css={cssHeader}>
            <Accordion.Item.Button css={cssButton}>
              <Icon icon="Arrow" className="arrow_ico" />
              <span>ハイライト</span>
            </Accordion.Item.Button>
          </Accordion.Item.Header>
          <Accordion.Item.Content css={cssContent}>
            koreha kontentu desu
          </Accordion.Item.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Settings
