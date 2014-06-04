class ChangeIdeologyAndLeadershipToConmen < ActiveRecord::Migration
  def change
		change_column :conmen, :ideology, :decimal, precision: 15, scale: 14
		change_column :conmen, :leadership, :decimal, precision: 15, scale: 14
  end
end
