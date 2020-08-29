class ChangeColumnToPost < ActiveRecord::Migration[6.0]
  def change
    change_column :posts, :content, :text
    change_column :posts, :content_source, :text
  end
end
