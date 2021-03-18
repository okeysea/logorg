/** @jsx jsx */
import { jsx, css } from "@emotion/react"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import useToggleState from "../hooks/useToggleState"
import useDocumentEventHandler from "../hooks/useDocumentEventHandler"

type Props = {
  value?: string
  onChange?: (value: string)=>void
  className?: string
}

const ClickToInput: React.FC<Props> = props => {
  const [ value, setValue ] = useState( props.value ? props.value : "" );
  const toggle = useToggleState([{key: "enabled"}]);
  const [ addDocEvent, removeDocEvent ] = useDocumentEventHandler( "click", (e) => {
    if( inputRef.current && inputRef.current.contains( e.target ) ) return;
    doEnable();
  });
  const inputRef = useRef(null);

  useEffect(()=>{
    if( toggle.state.enabled == true ) addDocEvent();
    if( toggle.state.enabled == false ){
      removeDocEvent();
      if( props.value != value ){
        props.onChange && props.onChange( value );
      }
    }
  },[toggle.state.enabled]);

  useEffect(()=>{
    setValue( props.value );
  }, [props.value]);

  const doEnable = () => {
    toggle.setter.enabled(false);
  };

  const inputChangeHandler = (e) => {
    setValue( e.target.value );
  }

  return (
    <React.Fragment>
    {
      (()=>{
        if( toggle.state.enabled ) {
          return <input value={value} onChange={inputChangeHandler} ref={inputRef} className={props.className}/> 
        }else{
          return <span onClick={()=>{toggle.setter.enabled(true)}} className={props.className}>{value}</span>
        }
      })()
    }
    </React.Fragment>
  );
}

export default ClickToInput
