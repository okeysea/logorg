import APIFactory from "./APIFactory"

declare global {
  interface Window {
    API: APIFactory
    Turbolinks: any
  }
}

window.API = new APIFactory();
