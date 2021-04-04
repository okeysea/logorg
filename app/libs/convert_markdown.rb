require './app/libs/org_md_parser'
require 'cgi/escape'

class ConvertMarkdown
  def initialize
    @parser = OrgMdParser.new()
  end

  def text_to_ast( str )
    @parser.parse_markdown(str)
  end

  def ast_to_html( ast )
    recursive_render_html [ast]
  end

  def ast_to_preview_html( ast )
    recursive_render_preview_html [ast]
  end

  private

    def recursive_render_html( ast_arr )
      output = ""
      ast_arr.each do | ast |

        case ast["elm_type"]
        when "Document"
          output << format("<div>%<value>s</div>", value: recursive_render_html(ast["children"])) 
        when "Paragraph"
          output << format("<p>%<value>s</p>", value: recursive_render_html(ast["children"])) 
        when "Headers"
          output << format("<%<tag>s>%<value>s</%<tag>s>", value: recursive_render_html(ast["children"]), tag: ast["elm_meta"].downcase) 
        when "Text"
          output << format("%<value>s", value: CGI.escapeHTML(ast["value"])) 
        when "Emphasis"
          output << format("<em>%<value>s</em>", value: recursive_render_html(ast["children"])) 
        when "SoftBreak"
        else
          output << format("<span>Undefined elm_type: %<elm_type>s</span>", elm_type: ast["elm_type"]) 
        end

      end
      output
    end

    def recursive_render_preview_html( ast_arr )
      output = ""
      ast_arr.each do | ast |

        case ast["elm_type"]
        when "Document"
          output << format("%<value>s", value: recursive_render_preview_html(ast["children"])) 
        when "Paragraph"
          output << format("%<value>s", value: recursive_render_preview_html(ast["children"])) 
        when "Headers"
          output << format("<b>%<value>s</b>", value: recursive_render_preview_html(ast["children"])) 
        when "Text"
          output << format("%<value>s", value: CGI.escapeHTML(ast["value"])) 
        when "Emphasis"
          output << format("<em>%<value>s</em>", value: recursive_render_preview_html(ast["children"])) 
        when "SoftBreak"
        else
          output << format("<span>Undefined elm_type: %<elm_type>s</span>", elm_type: ast["elm_type"]) 
        end

      end
      output
    end
end
