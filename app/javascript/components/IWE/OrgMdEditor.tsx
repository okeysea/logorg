/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useEffect } from "react"
import * as codemirror from "codemirror"
import {Controlled as ReactCodeMirror } from "react-codemirror2"
import "codemirror/theme/material.css"
import "codemirror/lib/codemirror.css"

import {AST} from "./OrgMdParser"

type Props = {
  value?: string,
  onChange?: (value: string) => void
  ast?: AST
  className?: string
}

const highlight_styles = {
  "Document":   "document",
  "Paragraph":  "paragraph",
  "Headers":    "headers",
  "Text":       "text",
  "Emphasis":   "emphasis",
  "SoftBreak":  "",
};

const OrgMdEditor: React.FC<Props> = props => {

  const [ stateValue, setStateValue ] = useState(props.value);
  const [ options, setOptions ] = useState({});
  const [ editor, setEditor ] = useState(null);


  const handleOnChange = ( editor: codemirror.Editor, data: codemirror.EditorChange, value: string ) => {
    console.log(data);
    if( props.onChange != undefined ) props.onChange( value );
  };

  const highlighter = ( nodes: Array<AST> ) => {
    if( editor != null ){
      for( let i = 0; i < nodes.length; i ++){
        let obj = nodes[i];
        let style = highlight_styles[obj.elm_type];
        if( style != undefined ) editor.markText(
          {line: obj.range.begin.line - 1, ch: obj.range.begin.ch - 1},
          {line: obj.range.end.line -1, ch: obj.range.end.ch - 1},
          {className: style}
        );
        highlighter(obj.children);
      }
    }
  }

  useEffect(()=>{
    if( editor != null ) editor.getAllMarks().forEach( mark=>{mark.clear()} );
    highlighter( [props.ast] );
  }, [props.ast]);

  useEffect(()=>{
    editor && editor.setSize("100%", "100%");
  }, [editor]);

  const testOnKeyDown = ( editor: codemirror.Editor, event: any ) => {
    console.log( event );
  };

  const highlight = css({
    "& .document": {
      fontSize: '1.4rem'
    },

    "& .headers": {
      fontSize: '1.6rem',
      fontWeight: "bold",
    }
  });

  return (
    <div css={highlight} className={props.className}>
      <ReactCodeMirror
        value={stateValue}
        options={options}

        onBeforeChange={(editor, data, value)=>{
          setStateValue(value);
        }}

        onChange={ handleOnChange }
        onKeyDown={ testOnKeyDown }
        editorDidMount={editor=>{setEditor(editor)}}
        className={props.className}
      />
    </div>
  );

}

export default OrgMdEditor