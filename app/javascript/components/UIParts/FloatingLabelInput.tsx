/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

const cssContainer = css({
  position: "relative",
  "& label": {
    position: "absolute",
    left: "8px",
    top: "0px",

    paddingLeft: "4px",
    paddingRight: "4px",

    opacity: 0,
    transition: "all 200ms",
  },
  "& input:not(:placeholder-shown) + label" : {
    background: "#f9f9fa",
    transform: "translate(0, -50%)",
    opacity: 1,
  },
  "& input": {
    padding: "12px",
    width: "100%",
  }
});

type Props = {
  value?: string,
  placeholder?: string,
  name?: string,
  className?: string,
  onChange?: (name: string, value: string)=>void,
  type?: "text" | "password"
}

const FloatingLabelInput: React.FC<Props> = props =>{

  const [value, setValue] = useState(props.value);

  useEffect(()=>{
    props.onChange && props.onChange( props.name, value );
  },[value]);

  const handleChange = (event) => {
    setValue( event.target.value );
  }

  return (
    <div css={cssContainer} className={props.className}>
      <input type={ props.type ? props.type : "text"} placeholder={props.placeholder} value={value} onChange={handleChange}/>
      <label>{props.placeholder}</label>
    </div>
  );

}

export default FloatingLabelInput
