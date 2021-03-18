require "wasmer"
require "json"

class OrgMdParser

  Pointer = Struct.new(:pointer, :length, :type)

  def initialize
    wasm_bytes = IO.read Rails.root.join("node_modules", "@okeysea", "orgmd_parser", "orgmd_parser_bg.wasm" ), mode: "rb"
    @instance = Wasmer::Instance.new wasm_bytes
  end

  # input: string output: AST
  def parse_markdown(str)
    input_ptr   = pass_to_wasm_string str
    output_ptr  = internal_parse_markdown input_ptr
    ret         = get_string_from_wasm output_ptr
    free_pointer input_ptr
    free_pointer output_ptr
    JSON.parse ret
  end

  private

    def free_pointer( pointer )
      case pointer.type
      when "ALLOCATED_C_STR"
        @instance.exports.deallocate pointer.pointer, pointer.length
      when "WASM_RETURN_C_STR"
        @instance.exports.deallocate_str pointer.pointer
      else
        @instance.exports.deallocate pointer.pointer, pointer.length
      end
    end

    # input: string, output: pointer
    def pass_to_wasm_string( str )
      ret_pointer = Pointer.new()
      ret_pointer.type = "ALLOCATED_C_STR"

      str_bytes = str.bytes
      str_length = str_bytes.length

      ret_pointer.length = str_length
      ret_pointer.pointer = @instance.exports.allocate ret_pointer.length
      input_memory = @instance.memory.uint8_view ret_pointer.pointer

      for nth in 0..str_length - 1
        input_memory[nth] = str_bytes[nth]
      end

      # Terminate by NULL
      input_memory[ret_pointer.length] = 0

      ret_pointer
    end

    # input: pointer, output: string
    def get_string_from_wasm( pointer )
      memory = @instance.memory.uint8_view pointer.pointer

      ret = ""
      nth = 0

      while true
        char = memory[nth]

        if 0 == char
          break
        end

        ret += char.chr
        nth += 1
      end

      ret
    end

    # input: pointer, output: pointer
    def internal_parse_markdown( pointer )
      ret_pointer = Pointer.new
      ret_pointer.type = "WASM_RETURN_C_STR"
      ret_pointer.pointer = @instance.exports.ffi_parse_markdown pointer.pointer
      ret_pointer
    end

end
