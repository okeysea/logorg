/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import FloatingLabelInput from "../UIParts/FloatingLabelInput"
import AvatarPicker from "../UIParts/AvatarPicker"
import {useAPIUser} from "../APIUserHooks"
import {dispatchFlash} from "../../Events/FlashMessageEvent"

const cssCenter = css({
  width: "380px",
  margin: "auto",
});

const cssContainer = css({
  display: "flex",
  flexDirection: "column",

  "& > div":{
    marginTop: "8px",
    marginBottom: "8px",
  }
});

const cssHasError = css({
  "& > input": {
    border: "1px solid #ff0000",
  }
});

const cssFormError = css({
  color: "#ff0000",
});

type Props = {
  userId: string
}

const FormUpdateUser: React.FC<Props> = props =>{

  const [ loaded, user ] = useAPIUser( props.userId );
  const [ errors, setErrors ] = useState({ name: [], password:[], passwordConfirmation: [] });

  const handleChanges = (name: string, value: string) => {
    if( user ){
      user[name] = value;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if( user ){
      user.update().then( result => {
        if( result.isSuccess() ){
          // do redirect
        }else if( result.isFailure() ){
          const errfield = result.value.getFormError("User");
          const valueOrArray = (value)=>{ return value === undefined ? [] : value};
          console.log( result );
          setErrors({
            name: valueOrArray(errfield["name"]),
            password: valueOrArray(errfield["password"]),
            passwordConfirmation: valueOrArray(errfield["password_confirmation"]),
          });
          dispatchFlash("ユーザー情報の更新に失敗しました！");
        }
      });
    }
  };

  const handleAvatar = (uri: string) => {
    if( user ) user.avatarDataUri = uri;
  };

  return (
    <React.Fragment>
    { loaded && 
      <div css={cssCenter}>
        <form onSubmit={handleSubmit} css={cssContainer}>
          <div>
            <FloatingLabelInput
            placeholder="名前(公開)"
            onChange={handleChanges}
            value={ user && user.name }
            name="name"
            css={css(errors.name.length ? cssHasError : {})}
            />
            <ul css={cssFormError}>
            { errors.name.map((value)=>{return <li>{value}</li>}) }
            </ul>
          </div>
          <div>
            <FloatingLabelInput
            placeholder="パスワード"
            onChange={handleChanges}
            name="password"
            type="password"
            css={css(errors.password.length ? cssHasError : {})}
            /> 
            <ul css={cssFormError}>
            { errors.password.map((value)=>{return <li>{value}</li>}) }
            </ul>
          </div>
          <div>
            <FloatingLabelInput
            placeholder="パスワード(再確認)"
            onChange={handleChanges}
            name="passwordConfirmation"
            type="password"
            css={css(errors.passwordConfirmation.length ? cssHasError : {})}
            /> 
            <ul css={cssFormError}>
            { errors.passwordConfirmation.map((value)=>{return <li>{value}</li>}) }
            </ul>
          </div>
          <div>
            <label>アバター</label>
            <AvatarPicker onChange={handleAvatar}/>
          </div>
          <button>ユーザー情報を更新</button>
        </form>
    </div>
  }
  </React.Fragment>
  );
}

export default FormUpdateUser;
