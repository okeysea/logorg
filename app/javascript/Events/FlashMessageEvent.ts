export const dispatchFlash = ( message: string ) => {
  const event = new CustomEvent("logorg:dispatchFlash", {detail: {message: message}});
  document.dispatchEvent( event );
};
