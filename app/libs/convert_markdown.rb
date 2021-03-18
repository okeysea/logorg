require './app/libs/org_md_parser'

class ConvertMarkdown
  def initialize
    @parser = OrgMdParser.new()
  end

  def to_html( str )
    recursive_render_html [@parser.parse_markdown(str)]
  end

  private

    def recursive_render_html( ast_arr )
      output = ""
      ast_arr.each{ | ast |
        case ast["elm_type"]
        when "Document"
          output += format("<div>%<value>s</div>", value: recursive_render_html(ast["children"])) 
        when "Paragraph"
          output += format("<p>%<value>s</p>", value: recursive_render_html(ast["children"])) 
        when "Headers"
          output += format("<h1>%<value>s</h1>", value: recursive_render_html(ast["children"])) 
        when "Text"
          output += format("%<value>s", value: ast["value"]) 
        when "Emphasis"
          output += format("<em>%<value>s</em>", value: recursive_render_html(ast["children"])) 
        when "SoftBreak"
        else
          output += format("<span>Undefined elm_type: %<elm_type>s</span>", elm_type: ast["elm_type"]) 
        end
      }
      output
    end
end
