export const dispatchFlash = ( message: string, type = "notice" ) => {
  const event = new CustomEvent("logorg:dispatchFlash", {detail: {message: message, type: type}});
  document.dispatchEvent( event );
};
