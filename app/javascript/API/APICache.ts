export default class APICache {
  public durtion: number
  private cacheData: {[key:string]:{ value: any, cached: number}}
  private caching: {[key:string]: boolean}

  constructor(durtion: number) {
    this.durtion = durtion;
    this.cacheData = {};
    this.caching = {};
  }

  isCached(key: string){
    if( this.cacheData[key] == undefined ) return false;

    const data = this.cacheData[key];
    const now = (new Date()).getTime();

    if( now - data.cached < this.durtion ) return true;
    return false;
  }

  isCaching(key: string){
    if( this.caching[key] == undefined ) return false;
    return this.caching[key];
  }

  setCaching(key: string, value: boolean){
    this.caching[key] = value;
  }

  cache(key: string){
    const nowCaching = this.isCaching(key);
    const isCached = this.isCached(key);
    return (
      {
        subject: (fn:()=>any) => {
          if( !nowCaching && !isCached ){
            this.setCaching( key, true );
            this.cacheData[key] = { value: fn(), cached: (new Date()).getTime() };
            this.setCaching( key, false );
          }
          return this.cache(key);
        },

        get: ()=>{
          return this.getCache(key);
        }
      }
    );
  }

  getCache( key: string ){
    return this.cacheData[key].value;
  }
}
