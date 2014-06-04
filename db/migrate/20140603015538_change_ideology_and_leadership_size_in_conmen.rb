class ChangeIdeologyAndLeadershipSizeInConmen < ActiveRecord::Migration
  def change
	  change_column :conmen, :ideology, :decimal, precision: 6, scale: 5
	  change_column :conmen, :leadership, :decimal, precision: 6, scale: 5	
  end
end
