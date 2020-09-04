class CreatePosts < ActiveRecord::Migration[6.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :post_id, null: false
      t.string :title, null: false
      t.string :content, null: false
      t.string :content_source, null: false

      t.timestamps
    end

    add_index :posts, [:post_id], unique: true
  end
end
