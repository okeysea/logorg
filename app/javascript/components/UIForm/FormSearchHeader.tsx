/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

const cssSearchFormContainer = css({
  display: "flex",
  height: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const cssForm = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "2em",

  overflow: "hidden",

  //border: "1px solid #d9e1e8",
  borderRadius: "8px",
});

const cssSpacer = css({
  flex: "1",
});

const cssSearchIconContainer = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  width: "2em",
  height: "100%",
  //background: "#d9e1e8",
  background: "transparent",

  cursor: "pointer",
});

const cssSearchInput = css({
  flex: "1",
  border: "none",
  background: "transparent",
  padding: "0.5em",
  outline: "0",
  color: "#f9f9fa",

  minWidth: "18em",
});


type Props = {
};

const FormSearchHeader: React.FC<Props> = props => {

  const [ searchWord, setSearchWord ] = useState("");
  const [ params, setParams ] = useState<URLSearchParams|null>(null);
  const [ submit, setSubmit ] = useState(false);
  const [ hiddenSearchWords, setHiddenSearchWords ] = useState( true );

  const searchInputRef = useRef<HTMLInputElement>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault();
    setSubmit( true );
  };

  const handleSearchIconClick = () => {
    setHiddenSearchWords(!hiddenSearchWords);
  };

  const doSubmit = () => {
    const currentURL = new URL("/posts", window.location.origin);
    params.delete("page");
    params.set("q", searchWord);
    currentURL.search = params.toString();
    window.Turbolinks.visit( currentURL.toString() );
  };

  useEffect(()=>{
    if( !params ){
      const p = (new URL(window.location.href)).searchParams
      setParams( p );

      if( p.get("q") ){
        setSearchWord( p.get("q") );
      }
    }
  }, []);

  useEffect(()=>{
    if( submit ) doSubmit();
  }, [submit]);

  useEffect(()=>{
    if( !hiddenSearchWords ){
      searchInputRef.current.focus();
    }
  }, [hiddenSearchWords]);


  return (
    <div css={cssSearchFormContainer}>
      <form onSubmit={handleSubmit} css={cssForm}>
        <div css={cssSearchIconContainer} onClick={handleSearchIconClick}>
          <i className="fas fa-search" />
        </div>
        <input
          type="text"
          value={searchWord}
          onChange={(e)=>setSearchWord(e.target.value)}
          css={cssSearchInput}
          placeholder="検索ワードを入力(Enter)"
          ref={searchInputRef}
          hidden={hiddenSearchWords}
        />
      </form>
    </div>
  );
};

export default FormSearchHeader
