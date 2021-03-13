import { useState } from "react"

const ARRAY_BIT_LENGTH = 8

const useSwitch = (
  n: number
): Array<{ on:()=>void, off:()=>void, toggle:()=>void getValue:()=>boolean}> {

  const [ value, setValue ] = useState(()=>{
    const len = ( n + ( ARRAY_BIT_LENGTH - n % ARRAY_BIT_LENGTH ) ) / ARRAY_BIT_LENGTH
    return new Uint8Array(len)
  });


}
