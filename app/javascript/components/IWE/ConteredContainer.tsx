import React, { useState, useCallback, useRef, useEffect } from "react"

interface ConteredContainerProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
}

interface ConteredContainerUncheckedProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  tagName?: any;
  className?: string;
}

const ConteredContainer: React.FC<ConteredContainerProps> = ({ tagName, ...otherProps})=> {
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return <Tag {...otherProps}/>
}

export const ConteredContainerUnchecked: React.FC<ConteredContainerUncheckedProps> = ({ tagName, ...otherProps})=> {
  const Tag = tagName;
  return <Tag {...otherProps}/>
}

ConteredContainer.defaultProps = {
  tagName: "div",
};

ConteredContainerUnchecked.defaultProps = {
  tagName: "div",
};

export default ConteredContainer;
