import { useState, useRef, useEffect } from "react"

const useDocumentEventHandler = (
  event: string,
  callback?: (e: any)=>void,
  relate?: Array<any>,
): [()=>void, ()=>void, (update: (e:any)=>void)=>void] => {

  const [ removed, setRemoved ] = useState( true );
  const [ handleChange, setHandleChange ] = useState( false );

  if( relate === undefined ) relate = [];

  const newHandler : any = useRef();
  const handler : any = useRef();

  useEffect( () => {
    if( !removed ){
      document.addEventListener( event, handler.current );
    }else{
      document.removeEventListener( event, handler.current );
    }
  }, [removed]);

  useEffect( () => {
    if( callback ){
      newHandler.current = (e: any) => {
        callback( e );
      };
      setHandleChange( true );
    }
  }, relate);

  useEffect( ()=> {

    if( callback ){
      handler.current = (e: any) => {
        callback( e );
      }
    }else{
      handler.current = () => {}
    }

    return () =>{ document.removeEventListener( event, handler.current ); };
  },[]);

  useEffect( ()=> {
    if( handleChange ){
      if( !removed ) document.removeEventListener( event, handler.current );
      handler.current = newHandler.current;
      if( !removed ) document.addEventListener( event, handler.current );
      setHandleChange( false );
    }
  },[handleChange, removed]);

  const add = () => {
    setRemoved( false );
  };

  const remove = () => {
    setRemoved( true );
  };

  const update = (updateCallback: (e:any)=>void) => {
    newHandler.current = e => updateCallback( e );
    setHandleChange( true );
  };

  return [ add, remove, update ];
}

export default useDocumentEventHandler;
