import React, { useState, useCallback, useRef, useEffect } from "react"
import { AST } from "./OrgMdParser"

type Props = {
  ast: AST
  className?: string
}

const OrgMdRenderer: React.FC<Props> = props => {

  return (
    <React.Fragment>
      <DocumentComponent astObjects={props.ast.children} />
    </React.Fragment>
  );

}

type DocumentComponentProps = {
  astObjects: Array<AST>
}

const DocumentComponent: React.FC<DocumentComponentProps> = props => {
  let list = [];
  for( let i = 0; i < props.astObjects.length; i ++ ){
    const obj = props.astObjects[i];
    switch( obj.elm_type ) {
      case "Document":
        break;
      case "Paragraph":
        list.push(<p><DocumentComponent astObjects={obj.children} /></p>);
        break;
      case "Headers":
        list.push(<h1><DocumentComponent astObjects={obj.children} /></h1>);
        break;
      case "Text":
        list.push(<React.Fragment>{obj.value}</React.Fragment>);
        break;
      case "Emphasis":
        list.push(<em><DocumentComponent astObjects={obj.children} /></em>);
        break;
      case "SoftBreak": 
        // スペース
        list.push(<React.Fragment> </React.Fragment>);
        break;
      default:
        list.push(<span>undefined elm_type: "{obj.elm_type}" <br /><pre>{JSON.stringify(obj)}</pre></span>);
        break;
    }
  }

  return (
    <React.Fragment>
      {list}
    </React.Fragment>
  );
}

export default OrgMdRenderer
