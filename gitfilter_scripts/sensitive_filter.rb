#! /usr/bin/env ruby

module REGEX
  METHOD      = /#\s*\[\s*(?<method>accept|delete|replace)\s+(?<target>'*[a-zA-Z0-9_\-.,@]+'*)\s*\]/
  DEFINE_STR  = /\A(?<before>\s*(?<variable>[a-zA-Z_]*)\s*[:=]\s*['"])(?<define>.*)(?<after>['"]\s*,*.*)/ 
  DEFINE_NUM  = /\A(?<before>\s*(?<variable>[a-zA-Z_]*)\s*[:=]\s*)(?<define>(0x|0b|0o|-|[0-9])[0-9_]*(i|ri){0,1})(?<after>\s*,*.*)/
end
REGEX.freeze

def detect_define(str)
  s = str.match(REGEX::DEFINE_STR)
  n = str.match(REGEX::DEFINE_NUM)
  return "STR" if !s.nil?
  return "NUM" if !n.nil?
  "OTHER"
end

def get_designated(str)
  if m = str.match(REGEX::METHOD)
    return m
  end
  nil
end

def replace_define_str(str, replace)
  if m = str.match( REGEX::DEFINE_STR )
    return "#{m[:before]}#{replace}#{m[:after]}"
  end
  nil
end

def replace_define_num(str, replace)
  if m = str.match( REGEX::DEFINE_NUM )
    return "#{m[:before]}#{replace}#{m[:after]}"
  end
  nil
end

# キーボード入力の場合終了
exit if !(File.pipe?(STDIN) || File.select([STDIN], [], [], 0) != nil)

while !((current_line = STDIN.gets).nil?) do
  exit if current_line.nil?
  designate   = get_designated(current_line) 
  method      = nil
  target      = nil
  type        = detect_define( current_line )
  replace_to_str  = ""
  replace_to_num  = 0

  if !designate.nil? 
    method = designate[:method]
    target = designate[:target]
  end

  # [delete line]だったらその行は出力しない
  if method == 'delete'
    if targer == 'line'
      next
    end
  end

  # [accept line]だったらその行は処理しない
  if method == 'accept'
    if target == 'line'
      puts current_line
      next
    end
  end

  # [replace hoge]だったらreplaceを指定
  if method == 'replace'
    replace_to_str = target
    replace_to_num = target
  end

  case type
  when "STR"
    puts replace_define_str( current_line, replace_to_str )
  when "NUM"
    puts replace_define_num( current_line, replace_to_num )
  when "OTHER"
    puts current_line;
  end
end

