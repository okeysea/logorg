/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import OrgMdRenderer from "./OrgMdRenderer"
import ProfileRowCard from "../ProfileRowCard"
import {AST} from "./OrgMdParser"

const cssPadding = css({
  padding: "2em"
});

const cssOverflow = css({
  overflowY: "scroll"
});

const cssMarkdown = css`
  a{ color: #0645ad; text-decoration:none;}
  a:visited{ color: #0b0080; }
  a:hover{ color: #06e; }
  a:active{ color:#faa700; }
  a:focus{ outline: thin dotted; }
  a:hover, a:active{ outline: 0; }

  ::selection{background:rgba(255,255,0,0.3);color:#000}

  a::selection{background:rgba(255,255,0,0.3);color:#0645ad}

  p{
    margin:1em 0;
  }

  img{
    max-width:100%;
  }

  h1,h2,h3,h4,h5,h6{
    font-weight:normal;
    color:#111;
    line-height:1em;
  }
  h4,h5,h6{ font-weight: bold; }
  h1{ font-size:2.5em; }
  h2{ font-size:2em; }
  h3{ font-size:1.5em; }
  h4{ font-size:1.2em; }
  h5{ font-size:1em; }
  h6{ font-size:0.9em; }

  blockquote{
    color:#666666;
    margin:0;
    padding-left: 3em;
    border-left: 0.5em #EEE solid;
  }

  hr { display: block; height: 2px; border: 0; border-top: 1px solid #aaa;border-bottom: 1px solid #eee; margin: 1em 0; padding: 0; }
  pre, code, kbd, samp { color: #000; font-family: monospace, monospace; _font-family: 'courier new', monospace; font-size: 0.98em; }
  pre { white-space: pre; white-space: pre-wrap; word-wrap: break-word; }

  b, strong { font-weight: bold; }

  dfn { font-style: italic; }

  ins { background: #ff9; color: #000; text-decoration: none; }

  mark { background: #ff0; color: #000; font-style: italic; font-weight: bold; }

  sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
  sup { top: -0.5em; }
  sub { bottom: -0.25em; }

  ul, ol { margin: 1em 0; padding: 0 0 0 2em; }
  li p:last-child { margin:0 }
  dd { margin: 0 0 0 2em; }

  img { border: 0; -ms-interpolation-mode: bicubic; vertical-align: middle; }

  table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
  }
  th { border-bottom: 1px solid black; }
  td { vertical-align: top; }

  @media only screen and (min-width: 480px) {
    body{font-size:14px;}
  }

  @media only screen and (min-width: 768px) {
    body{font-size:16px;}
  }
`;

const cssMarkdownContainer = css([
  cssPadding, cssMarkdown, cssOverflow
]);

type Props = {
  title?: string
  ast: AST
  className?: string
}

const OrgMdView: React.FC<Props> = props => {
  return (
    <div css={css([cssPadding, cssOverflow])} className={props.className}>
      <div data-scope-path="posts/show">
        <div className="document-container">
          <h1 className="document-title">{props.title}</h1>
          <div className="document-author">
            <ProfileRowCard userId={window.gon.user.public_id} size="middle" />
          </div>
          <div className="document-content" data-scope-path="marked-document">
            <OrgMdRenderer ast={props.ast} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrgMdView
