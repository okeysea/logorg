# db/seeds/ 以下のファイル
dev_seed_files = Dir[ Rails.root.join('db', 'seeds', '*.rb') ].sort

ActiveRecord::Base.transaction do
  dev_seed_files.each do |file|
    puts "exec #{File.basename(file)} seed"
    load(file)
  end
end
