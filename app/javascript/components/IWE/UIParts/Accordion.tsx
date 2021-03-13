/** @jsx jsx */
import { jsx, css } from "@emotion/react"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import useToggleState from "../hooks/useToggleState"

const cssAriaHidden = css({
  "[aria-hidden=true]": { 
    display: "none",
  }
});

const cssButton = css({
  cursor: "pointer"
});

type AccordionItemProps = {
  isOpen?: boolean
  toggle?: ()=>void
}

type Props = {
  className?: string
  children?: React.ReactNode
}

const Accordion: React.FC<Props> & {
  Item: typeof Item
} = props => {

  const genStateChildren = () => {
    let ret = [];
    React.Children.map( props.children, (child: any, idx) => {
      ret.push({ key: idx });
    });
    return ret;
  };

  const itemState = useToggleState( genStateChildren() );

  const getChildren = () => React.Children.map( props.children, (child: any, idx) => {
    return React.cloneElement(child, { isOpen: itemState.state[idx], toggle: itemState.toggler[idx] });
  });

  return (
    <div css={cssAriaHidden} className={props.className}>
      {getChildren()}
    </div>
  );
}

type ItemProps = {
  children?: React.ReactNode
  className?: string
} & AccordionItemProps;

const Item: React.FC<ItemProps> & {
  Header: typeof Header
  Button: typeof Button
  Content: typeof Content
} = props => {

  const getChildren = () => React.Children.map( props.children, (child: any) => {
    return React.cloneElement(child, { isOpen: props.isOpen, toggle: props.toggle });
  });

  return (
    <section aria-expanded={props.isOpen} className={props.className}>
      { getChildren() }
    </section>
  );
}

type HeaderProps = {
  children?: React.ReactNode
  className?: string
} & AccordionItemProps;

const Header: React.FC<HeaderProps> = props => {

  const getChildren = () => React.Children.map( props.children, (child: any) => {
    return React.cloneElement(child, { isOpen: props.isOpen, toggle: props.toggle });
  });

  return (
    <div className={props.className}>
      { getChildren() }
    </div>
  );
}

type ButtonProps = {
  className?: string
  children?: React.ReactNode
} & AccordionItemProps;

const Button: React.FC<ButtonProps> = props => {
  return (
    <div css={cssButton} aria-expanded={props.isOpen} onClick={props.toggle} className={props.className}>
      {props.children}
    </div>
  );
}

type ContentProps = {
  children?: React.ReactNode
  className?: string
} & AccordionItemProps;

const Content: React.FC<ContentProps> = props => {
  return (
    <div aria-hidden={!props.isOpen} className={props.className}>
      {props.children}
    </div>
  );
}

Item.Header     = Header;
Item.Button     = Button;
Item.Content    = Content;
Accordion.Item  = Item;

export default Accordion;


