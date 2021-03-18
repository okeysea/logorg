import { useState, useRef, useEffect } from "react"

const useDocumentEventHandler = (
  event: string,
  callback: (e: any)=>void 
): [()=>void, ()=>void] => {

  const [ removed, setRemoved ] = useState( true );

  const handler : any = useRef();
  useEffect( () => {
    if( !removed ){
      handler.current = e => {
        callback( e );
      }
      document.addEventListener( event, handler.current );
    }else{
      document.removeEventListener( event, handler.current );
    }
  }, [removed]);

  useEffect( () => {
    return () => {
      if( !removed ) document.removeEventListener( event, handler.current );
    }
  },[]);

  const add = () => {
    setRemoved( false );
  };

  const remove = () => {
    setRemoved( true );
  };

  return [ add, remove ];
}

export default useDocumentEventHandler;
