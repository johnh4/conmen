class CreateConmen < ActiveRecord::Migration
  def change
    create_table :conmen do |t|
      t.string :chamber
      t.integer :govtrack_id
      t.integer :ideology
      t.integer :leadership
      t.string :name
      t.string :party
      t.string :description
      t.integer :introduced_bills
      t.integer :cosponsored_bills
      t.integer :unique_cosponsors
      t.integer :total_cosponsors

      t.timestamps
    end
  end
end
