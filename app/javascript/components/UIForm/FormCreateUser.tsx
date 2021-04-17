/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"
import FloatingLabelInput from "../UIParts/FloatingLabelInput"
import AvatarPicker from "../UIParts/AvatarPicker"
import {useAPIUser} from "../APIUserHooks"
import {dispatchFlash} from "../../Events/FlashMessageEvent"

// 評価者用
const cssInfo = css({
  border: "3px solid #57de4a",
  background: "#e1f5c5",
  borderRadius: "5px",
  padding: "0.8em",
  marginTop: "0.5em",
  marginBottom: "2em",
});

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
}

const FormCreateUser: React.FC<Props> = props =>{

  const [ loaded, user ] = useAPIUser();
  const [ errors, setErrors ] = useState({ publicId: [], name: [], email:[], password:[], passwordConfirmation: [] });

  const handleChanges = (name: string, value: string) => {
    if( user ){
      user[name] = value;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if( user ){
      user.create().then( result => {
        if( result.isSuccess() ){

          window.Turbolinks.visit( result.value.getUrl() );

        }else if( result.isFailure() ){
          const errfield = result.value.getFormError("User");
          const valueOrArray = (value)=>{ return value === undefined ? [] : value};
          console.log( result );
          setErrors({
            publicId: valueOrArray(errfield["public_id"]),
            name: valueOrArray(errfield["name"]),
            email: valueOrArray(errfield["email"]),
            password: valueOrArray(errfield["password"]),
            passwordConfirmation: valueOrArray(errfield["password_confirmation"]),
          });
          dispatchFlash("ユーザー登録に失敗しました");
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
            placeholder="公開ID(公開)"
            onChange={handleChanges}
            name="publicId"
            css={css(errors.publicId.length ? cssHasError : {})}
            />
            <ul css={cssFormError}>
            { errors.publicId.map((value)=>{return <li>{value}</li>}) }
            </ul>
          </div>
          <div>
            <FloatingLabelInput
            placeholder="名前(公開)"
            onChange={handleChanges}
            name="name"
            css={css(errors.name.length ? cssHasError : {})}
            />
            <ul css={cssFormError}>
            { errors.name.map((value)=>{return <li>{value}</li>}) }
            </ul>
          </div>
          <div>
            <FloatingLabelInput
            placeholder="メールアドレス(非公開)"
            onChange={handleChanges}
            name="email"
            css={css(errors.email.length ? cssHasError : {})}
            />
            <ul css={cssFormError}>
            { errors.email.map((value)=>{return <li>{value}</li>}) }
            </ul>
          </div>
          <span css={cssInfo}>メールアドレスに'@activated.example.com'ドメインを使用するとアクティベーションをスキップできます</span>
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
          <button>登録する</button>
        </form>
    </div>
  }
  </React.Fragment>
  );
}

export default FormCreateUser;
