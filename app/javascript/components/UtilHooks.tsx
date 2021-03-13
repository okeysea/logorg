import React, { useState, useCallback, useRef, useEffect } from "react"

//「React Hooksで保持する参照を毎回初期化しないようにする - yuhei blog」
// https://yuheiy.hatenablog.com/entry/2020/02/20/235918
export function useLazyInitializableRef<T>(create: ()=>T ): T {
  const [value] = useState(create);
  return value;
}

export function useWindowSize(): { width: number, height: number } {
  const getWindowSize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [ windowSize, setWindowSize ] = useState(getWindowSize());
  useEffect(()=>{
    const onResize = () => {
      setWindowSize(getWindowSize());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });
  return windowSize;
}
