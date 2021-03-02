const wasm = import("@okeysea/orgmd_parser");

export interface ASTPos {
  line: number,
  ch: number,
  pos: number
}

export interface ASTRange {
  begin: ASTPos,
  end: ASTPos,
}

export interface AST {
  elm_type: string,
  elm_meta: string,
  value: string,
  raw_value: string,
  range: ASTRange,
  children: Array<AST>
}

export default class OrgMdParser {
  constructor(){
  }

  async parseRawStringToJson(value: string): Promise<string> {
    let ret: string;
    await wasm.then( orgmd => {
      ret = orgmd.parse_markdown(value);
    });
    return ret;
  }

  async parseRawStringToAST(value: string): Promise<AST> {
    let ret: AST;
    ret = JSON.parse(await this.parseRawStringToJson(value));
    return ret;
  }
}
