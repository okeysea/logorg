if File.exist?("/project/tmp/sockets/puma.sock")
  puts "HEALTH CHECK: puma_started"
  puts "HEALTH RESULT: OK(0)"
  exit 0
else
  puts "HEALTH CHECK: puma_started"
  puts "HEALTH RESULT: FAULT(1)"
  exit 1
end
