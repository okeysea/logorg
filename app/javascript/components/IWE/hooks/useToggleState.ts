import { useState } from "react"

/*
 * トグル形式のステータスを管理するもの
 * ただしラジオボタンみたいに、選択したもの以外をfalseにする
 * 
 * Usage:
 *  const {toggle} = useToggleState([
 *    {key:"menu1", initial: true},
 *    {key:"menu2"},
 *    {key:"menu3"},
 *  ]);
 *
 *  return (
 *    <div>
 *      <span>{current}</span>
 *      <button onClick={toggler.menu1}>{status.menu1 ? "*" : "menu1"}</button>
 *      <button onClick={toggler.menu2}>{status.menu2 ? "*" : "menu2"}</button>
 *      <button onClick={toggler.menu3}>{status.menu3 ? "*" : "menu3"}</button>
 *      <button onClick={toggler.util.allEnable}>All Enbale</button>
 *    </div>
 *  );
 *
 * */

export type ToggleStateForm<T> = {
  key:      T
  initial?: boolean
  fixed?:   boolean
}

/*
export type ToggleStateOptions = {
  setNameUtilFuncObj:    string,
  genUtilFunc?:         boolean,
    genAllEnable?:        boolean,
    genAllDisable?:       boolean,
}
*/
export type ToggleStateCurrent  = string | undefined;
export type ToggleStateToggler  = {[key:string]: ()=>void};
export type ToggleStateStates   = {[key:string]: boolean};
export type ToggleStateSetter  =  {[key:string]: (value: boolean)=>void};

const useToggleState = <T extends string | number>(
  items: Array<ToggleStateForm<T>>
): {
  current: ToggleStateCurrent,
  toggler: ToggleStateToggler,
  state:   ToggleStateStates,
  setter:  ToggleStateSetter,
} => {

  const [ current, setCurrent ] = useState(undefined);

  const [ flags, setFlags ] = useState<Array<boolean>>(()=>{
    // デフォルト処理
    items = items.map((value)=>{
      return {
        key:     value.key,
        initial: value.initial == undefined ? false : value.initial,
      };
    });
    return items.map((value)=>{ 
      if( value.initial ) setCurrent( value.key );
      return value.initial;
    });
  });

  // 自分自身をトグルして、その他をfalseにするクロージャーを生成して返す
  const toggler = items.reduce<{[key:string]:()=>void}>((func, current, idx)=>{
    func[current.key] = ():void=>{
      setFlags(flags.map((flagsValue, flagsIdx) => {
        if(flagsIdx == idx){
          if( !flagsValue ){ setCurrent(current.key); } else { setCurrent(undefined); }
          return !flagsValue;
        }else{
          return false;
        }
      }));
    };
    return func;
  }, {});

  // 自分自身の状態を返すobjを返す
  const state = items.reduce<{[key:string]:boolean}>((obj, current, idx)=>{
    obj[current.key] = flags[idx];
    return obj;
  }, {});

  const setter = items.reduce<{[key:string]:(value: boolean)=>void}>((func, current, idx)=>{
    func[current.key] = (value: boolean):void=>{
      setFlags(flags.map((flagsValue, flagsIdx) => {
        if(flagsIdx == idx){
          if( value ){ setCurrent(current.key); } else { setCurrent(undefined); }
          return value;
        }else{
          return false;
        }
      }));
    };
    return func;
  }, {});

  return {current, toggler, state, setter};
}

export default useToggleState;
