class ConmenController < ApplicationController
  def ideology
		puts "params[:govtrack_id]: #{params[:govtrack_id]}"
		@conman = Conman.find_by(govtrack_id: params[:govtrack_id].to_i)
		puts "@conman.description: #{@conman.description}"
		render json: @conman.to_json
  end

	def similar
		@conman = Conman.find_by(govtrack_id: params[:govtrack_id].to_i)
		@similar = Conman.where(description: @conman.description)
		data = {}
		data[:conmen] = @similar
		render json: data.to_json
	end
end
