/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

const cssSearchFormContainer = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

const cssForm = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "2em",

  overflow: "hidden",

  border: "1px solid #d9e1e8",
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
  background: "#d9e1e8",

  cursor: "pointer",
});

const cssSearchInput = css({
  flex: "1",
  border: "none",
  background: "transparent",
  padding: "0.5em",
  outline: "0",

  minWidth: "18em",
});

const cssSelectWrap = css({
  position: "relative",
  background: "#d9e1e8",
  height: "100%",

  "&::before": {
    borderTop: "4.5px solid #7a8c98",
    borderLeft: "4px solid transparent",
    borderRight: "4px solid transparent",
    content: "''",
    position: "absolute",
    right: "6px",
    top: "calc(1em - 2px)",
    width: "0",

    pointerEvents: "none",
  },
});

const cssSelect = css({
  height: "100%",
  minWidth: "5em",

  background: "transparent",
  appearance: "none",
  padding: "0 0.5em",
  border: "none",
  outline: "0",
});

const cssOrderContainer = css({
  height: "100%",
  minWidth: "6em",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",

  background: "transparent",

  "a" : {
    display: "flex",
    background: "#d9e1e8",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    padding: "0 0.2em",
    borderBottom: "2px solid #a9b5bd",
    cursor: "pointer",

    color: "#9baec8",


    "&.select" : {
      background: "#f9f9fa",
      color: "#2b90d9",
      boxShadow: "none",
      borderBottom: "none",
      position: "relative",
    },

    "&:active" : {
      background: "#f9f9fa",
      color: "#2b90d9",
      boxShadow: "none",
      borderBottom: "none",
      position: "relative",
    },
  }
});

type OrderByOptionsProps = {
  sorts: Array<{key: string, display: string}>
}

const OrderByOptions:React.FC<OrderByOptionsProps> = props => {
  const list = props.sorts.map((value)=>{
    return <option value={value.key}>{value.display}</option>
  });
  return (
    <React.Fragment>
      {list}
    </React.Fragment>
  );
};

type Props = {
  sorts: Array<{key: string, display: string}>
  defaultOrderByKey: string
  defaultOrder: string
};

const FormSearch: React.FC<Props> = props => {

  const [ isURLWord, setIsURLWord ] = useState(false);
  const [ searchWord, setSearchWord ] = useState("");
  const [ params, setParams ] = useState<URLSearchParams|null>(null);
  const [ orderBy, setOrderBy ] = useState("");
  const [ order, setOrder ] = useState("");
  const [ submit, setSubmit ] = useState(false);
  const [ hiddenSearchWords, setHiddenSearchWords ] = useState( true );

  const searchInputRef = useRef<HTMLInputElement>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault();
    setSubmit( true );
  };

  const handleOrderByClick = (event: React.FormEvent<HTMLElement>, orderBy) => {
    event.preventDefault();
    setOrder( orderBy );
    setSubmit( true );
  };

  const handleSearchIconClick = () => {
    setHiddenSearchWords(!hiddenSearchWords);
  };

  const doSubmit = () => {
    console.log("do submit");
    const currentURL = new URL(window.location.href);
    params.delete("page");
    params.set("q", searchWord);
    params.set("b", orderBy);
    params.set("o", order);
    currentURL.search = params.toString();
    window.Turbolinks.visit( currentURL.toString() );
  };

  useEffect(()=>{

    if( !params ){
      const p = (new URL(window.location.href)).searchParams
      setParams( p );

      if( p.get("q") ){
        setSearchWord( p.get("q") );
        setIsURLWord( true );
        setHiddenSearchWords( false );
      }

      setOrderBy( p.get("b") ? p.get("b") : props.defaultOrderByKey );
      setOrder( p.get("o") ? p.get("o") : props.defaultOrder );
    }

  }, []);

  useEffect(()=>{
    if( submit ) doSubmit();
  }, [submit]);

  useEffect(()=>{
    if( hiddenSearchWords && isURLWord ){
      // 検索キーワードインプットが非表示になったら
      // 検索キーワードを消して再検索
      setSearchWord("");
      setSubmit(true);
    }else{
      searchInputRef.current.focus();
    }
  }, [hiddenSearchWords]);


  return (
    <div css={cssSearchFormContainer}>
      <div css={cssSpacer} />
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
          hidden={hiddenSearchWords}
          ref={searchInputRef}
        />
        <div css={cssSelectWrap}>
          <select css={cssSelect} value={orderBy} onChange={(e)=>{setOrderBy(e.target.value);setSubmit(true);}}>
            <OrderByOptions sorts={props.sorts} />
          </select>
        </div>
        <div css={cssOrderContainer}>
          <a
          className={order == "asc" ? "select" : ""}
          onClick={(e)=>{handleOrderByClick(e, "asc")}}
          >
            <span>昇順</span>
          </a>

          <a
          className={order == "desc" ? "select" : ""}
          onClick={(e)=>{handleOrderByClick(e, "desc")}}
          >
            <span>降順</span>
          </a>
        </div>
      </form>
    </div>
  );
};

export default FormSearch
