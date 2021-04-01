import APIFactory from "./APIFactory"

declare global {
  interface Window {
    API: APIFactory
  }
}

window.API = new APIFactory();
