/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React from "react"
import "../icons/style.css"

/*
.icon-Arrow:before {
  content: "\e901";
}
.icon-Document-Gear:before {
  content: "\e900";
}
.icon-Gear:before {
  content: "\e902";
}
.icon-Table-of-contents:before {
  content: "\e903";
}
 */

export type IconSet = "Arrow" | "Document-Gear" | "Gear" | "Table-of-contents"

type Props = {
  className?: string,
  icon?: IconSet
}

const Icon: React.FC<Props> = props => {
  return (
      <i className={`icon-${props.icon} ${props.className}`}></i>
  );
};

export default Icon;
