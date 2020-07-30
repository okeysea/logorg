class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :public_id,        null: false
      t.string :name,             null: false
      t.string :email,            null: false
      t.string :password_digest,  null: false

      t.timestamps
    end

    add_index :users, [:public_id, :email], unique: true
  end
end
