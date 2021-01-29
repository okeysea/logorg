import * as React from "react"
import { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from 'classnames'

/* note:
 *    import deepEqual from 'deep-equal'
 *    だと、jestでテスト時 deep_equal_1.default にトランスパイルされ、
 *    deep_equal_1.default is not a function でテストが落ちるため
 *    requireを用いる。モジュールの実装でDefaultが定義されていないのが原因か、
 *    Typescriptのトランスパイルの問題なのか特定できず。
 *    ブラウザでの実行時はwebpackがよしなにしてくれているのか問題はおこらない。
 */
const deepEqual = require('deep-equal')

// useStateの前回値を保持する関数
function usePrevious(value: any) {
  const ref = useRef(null)
  useEffect( () => {
    ref.current = value
  });
  return ref.current
}

/* --------------- */


type Props = Partial<{
  children: React.ReactNode
}>

// メニュー位置調整のためのコンテクスト
const ResourceContext = React.createContext({
  triggerTop: 0,
  triggerLeft: 0,
  // top, left
  setTriggerPos: (t: number,l: number) => {},
  triggerWidth: 0,
  triggerHeight: 0,
  // width, height
  setTriggerSize: (w: number,h: number) => {}
});

const Dropdown: React.FC<Props> & {
  Trigger: typeof Trigger
  Item:    typeof Item
  Divider: typeof Divider
  Menu:    typeof Menu
} = props => {

  const menuToggle = (): void => {
    // イベントハンドラの登録と処理
    if(active){
      removeDocumentClickHandler();
    }else{
      addDocumentClickHandler();
    }

    setActive( !active );
  }

  // children のエレメントを掌握
  const getChildren = () => React.Children.map( props.children, (child: any) => {
    if( child.type === Trigger ){ 
      return React.cloneElement(child, { onClick: menuToggle });
    }
    if( child.type === Menu ){
      return React.cloneElement(child, { active: active });
    }
  });

  const [active, setActive] = useState(false);
  const prevActive = usePrevious(active);
  const [children, setChildren] = useState( getChildren() );
  const prevChildren = usePrevious(children);

  // 位置調整のためTriggerタグの位置、サイズを保持
  const [triggerTop, setTriggerTop]       = useState(0);
  const [triggerLeft, setTriggerLeft]     = useState(0);
  const [triggerWidth, setTriggerWidth]   = useState(0);
  const [triggerHeight, setTriggerHeight] = useState(0);

  const setTriggerPos = (t: number,l: number): void => {
    setTriggerTop(t);
    setTriggerLeft(l);
  };

  const setTriggerSize = (w: number,h: number): void => {
    setTriggerWidth(w);
    setTriggerHeight(h);
  };

  // コンテクストをパック
  const context = {
    triggerTop: triggerTop,
    triggerLeft: triggerLeft,
    setTriggerPos: setTriggerPos,
    triggerWidth: triggerWidth,
    triggerHeight: triggerHeight,
    setTriggerSize: setTriggerSize
  }

  const dropdownRef = useRef(null);

  const mounted = useRef(false);
  useEffect( () => {
    if(mounted.current) {
      if( active && prevActive !== active ){
        setChildren( getChildren() );
      }
      if( !deepEqual(prevChildren, props.children) ){
        setChildren( getChildren() );
      }
    }else{
      // componentDidMount
      mounted.current = true;
    }
    // componentWillUnmount
    return () => {
    };
  }, [active]);

  // イベントを処理する関数が毎回生成されてしまったら困るのでuseRef
  const documentClickHandler: any = useRef();
  useEffect( () => {
    // コンポーネント外をクリックされたとき閉じる処理
    documentClickHandler.current = e => {
      if( dropdownRef.current.contains( e.target )) return;
      setActive(false);
      removeDocumentClickHandler();
    }
  }, []);

  const removeDocumentClickHandler = () => {
    document.removeEventListener('click', documentClickHandler.current);
  }

  const addDocumentClickHandler = () => {
    document.addEventListener('click', documentClickHandler.current);
  }

  return (
    <ResourceContext.Provider value={context}>
      <div
        className={ classNames('dropdown', { active: active }) }
        data-scope-path="components/dropdown"
        ref={dropdownRef}
      >
      { children }
      </div>
    </ResourceContext.Provider>
  )
}

/* --------------- */
type ButtonProps = {
  onClick?:   (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  children?:  React.ReactNode
  hover?: boolean
}

const Trigger: React.FC<ButtonProps> = props => {
  const context = React.useContext(ResourceContext);
  const triggerRef = useRef(null);

  const mounted = useRef(false);
  useEffect( () => {
    if(mounted.current) {

    }else{
      // 要素サイズ、位置を取得
      context.setTriggerSize(
        triggerRef.current.clientWidth,
        triggerRef.current.clientHeight
      );

      context.setTriggerPos(
        triggerRef.current.clientTop,
        triggerRef.current.clientLeft
      );
      mounted.current = true;
    }
  });

  return (
    <button
      className="dropdown-trigger"
      onClick={props.onClick}
      ref={triggerRef}
    >
      { props.children }
    </button>
  )
}

/* --------------- */

type ItemProps = {
  href?: string
  children: React.ReactNode
}

const Item: React.FC<ItemProps> = props => {
  return (
    <a
    className="dropdown-item"
    href={props.href}
    >
      { props.children }
    </a>
  )
}

/* --------------- */ 

type MenuProps = Partial<{
  active:   boolean
  children: React.ReactNode
}>

const Menu: React.FC<MenuProps> = props => {
  const context = React.useContext(ResourceContext);
  const menuRef = useRef(null);

  const x = context.triggerWidth;
  const y = context.triggerTop + context.triggerHeight;

  // ドロップダウンメニューの位置を計算
  // TODO: その他の位置をパラメータで指定できるようにする
  const styles = {
    transform: `translate(calc(-100% + ${x}px),${y}px)`
  };

  return (
    <div
      className={classNames('dropdown-menu', {show: props.active, hide: !props.active})}
      style={styles}
      ref={menuRef}
    >
      { props.active && props.children }
    </div>
  )
}

/* --------------- */

const Divider: React.FC = () => {
  return (
    <div className="dropdown-divider"></div>
  )
}

/* --------------- */

Dropdown.Trigger  = Trigger
Dropdown.Item     = Item
Dropdown.Divider  = Divider
Dropdown.Menu     = Menu

export default Dropdown
