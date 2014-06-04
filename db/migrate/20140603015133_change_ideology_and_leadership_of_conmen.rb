class ChangeIdeologyAndLeadershipOfConmen < ActiveRecord::Migration
  def change
	  change_column :conmen, :ideology, :decimal	
	  change_column :conmen, :leadership, :decimal	
  end
end
