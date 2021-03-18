/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import Icon, { IconSet } from "./UIParts/Icon"

import useToggleState, {ToggleStateCurrent, ToggleStateToggler, ToggleStateStates} from "./hooks/useToggleState"

const cssNaviSide = css({
  backgroundColor: "#282c37",
  top: "34px",
  left: "0px",
  bottom: "0px",
  width: "34px",
  height: "100%",
  position: "fixed",
  
  display: "flex",
  flexDirection: "column",
  alignItem: "center",
});

const cssSpan = css({
  marginBottom: "10px",
});

const cssButton = css({
  height: "34px",
  width: "34px",
  color: "#eee",
  cursor: "pointer",
  border: "none",
  borderRadius: "2px",
  boxSizing: "border-box",
  padding: "0px",
  background: "transparent none repeat scroll 0% 0%",

  outline: "none",

  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

const cssButtonActive = css({
  backgroundColor: "#eee",
  color: "#282c37",
});

const cssIcon = css({
  fontSize: "22px",
});


type NavigationProps = {
  icon: IconSet,
  state: boolean,
  onClick?: ()=>void,
}

const NavigationButton: React.FC<NavigationProps> = props => {

  const cssButtonToggle = css([cssButton, cssButtonActive]);

  return (
      <span css={cssSpan}>
        <button css={ props.state ? cssButtonToggle : cssButton} onClick={props.onClick}>
          <Icon css={cssIcon} icon={props.icon} />
        </button>
      </span>
  );
}

type OrgMdNaviSideMenus = Array<{ name: string, ico: IconSet }>
type OrgMdNaviSideMenuState = { 
  menus: OrgMdNaviSideMenus,
  toggler: ToggleStateToggler,
  states: ToggleStateStates
}

export const useNaviSideMenu = (
  menus: OrgMdNaviSideMenus
): [ ToggleStateCurrent, OrgMdNaviSideMenuState] => {

  const toggle = useToggleState(
    menus.reduce((arr, obj, idx)=>{
      arr[idx] = { key: obj.name };
      return arr;
    }, [])
  );

  return [ toggle.current, { menus, toggler: toggle.toggler, states: toggle.state } ];
};

type Props = {
  menuState: OrgMdNaviSideMenuState
}

const OrgMdNaviSide: React.FC<Props> = props => {

  return (
    <nav css={cssNaviSide}>
      { props.menuState.menus.map((item)=>(
        <NavigationButton state={props.menuState.states[item.name]} onClick={props.menuState.toggler[item.name]} icon={item.ico} />
      ))}
    </nav>
  );
}

export default OrgMdNaviSide
