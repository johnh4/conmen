class TweetsController < ApplicationController
  def congress
  end
	
	def all_tweets
		batch = TweetBatch.new
		data = batch.all_tweets
		render json: data.to_json
	end

	def refresh_tweets
		batch = TweetBatch.new(params[:last_id])
		data = batch.new_tweets
		render json: data.to_json
	end

	def state_tweets
		batch = TweetBatch.new(nil, params[:state_congs])
		data = batch.all_tweets
		render json: data.to_json
	end

	def refresh_state_tweets
		batch = TweetBatch.new(params[:last_id], params[:state_congs])
		data = batch.new_tweets
		render json: data.to_json
	end
end
