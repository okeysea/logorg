import { act, renderHook } from "@testing-library/react-hooks"
import useToggleState from "../../../../app/javascript/components/IWE/hooks/useToggleState"

describe('IWE Hooks useToggleState', ()=>{
  it('toggle test', ()=>{
    const {result} = renderHook(()=> useToggleState([{
      key: "test"
    }]));

    expect(result.current.current).toEqual( undefined );
    expect(result.current.state.test).toEqual(false);

    act(()=>{
      result.current.toggler.test();
    });

    expect(result.current.current).toEqual("test");
    expect(result.current.state.test).toEqual(true);

    act(()=>{
      result.current.toggler.test();
    });

    expect(result.current.current).toEqual( undefined );
    expect(result.current.state.test).toEqual(false);
  });

  // 初期値を指定した場合
  it('initial test', ()=>{
    const {result} = renderHook(()=> useToggleState([{
      key: "test",
      initial: true,
    }]));

    expect(result.current.current).toEqual( "test" );
    expect(result.current.state.test).toEqual(true);

    act(()=>{
      result.current.toggler.test();
    });

    expect(result.current.current).toEqual( undefined );
    expect(result.current.state.test).toEqual(false);

    act(()=>{
      result.current.toggler.test();
    });

    expect(result.current.current).toEqual( "test" );
    expect(result.current.state.test).toEqual(true);
  });
});
