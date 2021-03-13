/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import SplitPane, { Pane } from "react-split-pane"

import OrgMdParser from "./IWE/OrgMdParser"
import OrgMdEditor from "./IWE/OrgMdEditor"
import OrgMdView from "./IWE/OrgMdView"

import Settings from "./IWE/UIComponent/Settings"

import OrgMdNaviHeader from "./IWE/OrgMdNaviHeader"
import OrgMdNaviSide, { useNaviSideMenu } from "./IWE/OrgMdNaviSide"

import LogOrgAPI, {Post} from "./LogOrgAPI"
import { useLazyInitializableRef, useWindowSize } from "./UtilHooks"

import {cssHeightFull} from "./IWE/style/common"

const Parser = new OrgMdParser();
const API = new LogOrgAPI();

/*
 * 最上位のコンテナスタイル
 * 画面いっぱい
 */
const cssIWE = css({
  position: "fixed",
  width:    "100%",
  height:   "100%",
  inset:    "0px",
  backgroundColor: "#f9f9fa",
});

const cssPaneContainer = css({
  border: "1px solid #d9e1e8",
});

const cssContainer = css({
  display: "flex",
  height: "100%",
});

const cssEditorContainer = css({
  position: "fixed",
  inset: "34px 0px 0px 34px",
  height: "auto",
});

const cssResizer = css({
  "& .Resizer": {
    zIndex: 10000,
    boxSizing: "border-box",
    backgroundClip: "padding-box",
  },
  "& .Resizer:hover": {
    transition: "all 0.5s ease",
  },
  "& .Resizer.horizontal": {
    height: "4px",
    margin: "-1px 0",
    cursor: "row-resize",
    width: "100%",
    border: "2px solid #d9e1e8",
    opacity: "0",
  },

  "& .Resizer.horizontal:hover": {
    opacity: ".4",
  },
  "& .Resizer.vertical": {
    margin: "0 -2px",
    cursor: "col-resize",
    backgroundColor: "#d9e1e8",
    border: "2px solid #d9e1e8",
    opacity: "0",
  },
  "& .Resizer.vertical:hover": {
    opacity: ".4",
  },
  "& .Resizer.disabled": {
    cursor: "not-allowed",
  },
  "& .Resizer.disabled.hover": {
    borderColor: "transparent",
  },
  "& .Resizer:after,.Resizer:before": {
    content: '""',
    borderLeft: "1px solid #333",
    position: "absolute",
    top: "50%",
    transform: "translateY(-100%)",
    right: "0",
    display: "inline-block",
    height: "20px",
    margin: "0 2px",
  },
});

const cssPaneHidden = css({
  "& > .Pane1": {
    width: "0px !important",
  },
  "& > .Pane2": {
    width: "100% !important",
  },
});

const cssSideColumnHidden = css([
  cssResizer, cssPaneHidden
]);

type Props = {
  post_id?: string,
}

const OrgMdIWE: React.FC<Props> = props => {

  const post: Post = useLazyInitializableRef( ()=>{return API.factoryPost(props.post_id)} );
  const [ loading, setLoading ] = useState(true);
  const [ docRaw, setDocRaw ] = useState("");
  const [ docAST, setDocAST ] = useState({
    elm_type: "Document",
    elm_meta: "",
    value: "",
    raw_value: "",
    range: { begin: {line:0, ch:0, pos:0}, end: {line:0, ch:0, pos: 0} },
    children: [],
  });
  const windowSize = useWindowSize();

  const [ sideMenuCurrent, sideMenusState ] = useNaviSideMenu([
    {name: "settings", ico: "Gear"},
    {name: "toc", ico: "Table-of-contents"},
    {name: "doc-settings", ico: "Document-Gear"}
  ]);

  const editorChange = async (value: string): Promise<void> => {
    console.log(value);
    setDocRaw(value);
    let ast = await Parser.parseRawStringToAST(value);
    setDocAST(ast);
  }

  const testSave = () => {
    console.log(post.content);
    post.setTitle("LogOrgAPI Test");
    post.setContent(docRaw);
    post.update();
    console.log(post.content);
  }

  useEffect(()=>{
    post.sync().then( (post)=>{
      setLoading(false);
      editorChange(post.content);
    } );
  }, [props.post_id]);

  return (
    <React.Fragment>
      <div data-scope-path="component/orgmdiwe" css={cssIWE}>
        <OrgMdNaviHeader />
        <div css={cssContainer}>
          <OrgMdNaviSide menuState={sideMenusState}/>
          <div css={cssEditorContainer}>
            <SplitPane
              css={ sideMenuCurrent ? cssResizer : cssSideColumnHidden }
              split="vertical"
              minSize={ windowSize.width * (10/100)}
              defaultSize="20%" maxSize={ 250 }
            >
              <Settings css={css([cssPaneContainer, cssHeightFull])}/>
              <SplitPane split="vertical" minSize={ windowSize.width * (30/100)} defaultSize="50%" maxSize={ windowSize.width * (70/100) }>
                { loading ? <span>Loading...</span> : <OrgMdEditor value={post.content} onChange={editorChange} ast={docAST} css={cssHeightFull}/> }
                <OrgMdView ast={docAST} css={[cssPaneContainer, cssHeightFull]} />
              </SplitPane>
            </SplitPane>
          </div>
        </div>
      </div>
      <button onClick={testSave}>保存する！</button>
    </React.Fragment>
  );
}

export default OrgMdIWE
