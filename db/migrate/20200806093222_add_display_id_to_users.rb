class AddDisplayIdToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :display_id, :string, null: false
  end
end
