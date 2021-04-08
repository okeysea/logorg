module PostsHelper

  def highlight_keyword( content, keyword: "", length: 100 )

    keyword = "" if keyword.nil?
    keywords = keyword.split(/[\p{blank}\s]+/)
    dist_content = content

    unless keyword.blank?
      reg_keywords = keywords.map{|v| Regexp.escape(v)}.join("|")

      re = Regexp.new( /(#{reg_keywords})/ )
      m = re.match( content )
      if m
        if m[1]
          match_begin = m.begin(1)
          match_length = m[1].length
          match_center = match_begin + (match_length / 2).floor

          length_half = (length / 2).floor

          adjust = [content.length - (match_center + length_half), 0].min.abs
          slice_index = [match_center - (length_half + adjust), 0].max
          dist_content = content.slice( slice_index, content.length )
        end
      end
    end
    
    trun_line = truncate(dist_content, length: length)

    highlight(trun_line, keywords, highlighter: '<span class="search-highlight">\1</span>')
  end

end
