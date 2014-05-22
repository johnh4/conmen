class HomeController < ApplicationController
	
	def index
	end

	def events
	end

	def all_tweets
		#get tweets from list
		url = 'https://twitter.com/cspan/members-of-congress'
		list = URI.parse(url)
		listed_tweets =$client.list_timeline(list)
		
		#extract the information that we want
		tweets = []
		listed_tweets.each do |tweet|
			new_tweet = {}
			new_tweet[:name] = tweet.user.name
			new_tweet[:screen_name] = tweet.user.screen_name
			new_tweet[:text] = tweet.text
			new_tweet[:created_at] = tweet.created_at
			new_tweet[:profile_image_url] = tweet.user.profile_image_uri
			new_tweet[:profile_background_image_url] = 
			        tweet.user.profile_background_image_url
			new_tweet[:retweet] = tweet.retweet?
			if tweet.media?
				new_tweet[:media] = tweet.media
			end
			tweets << new_tweet
		end
		
		data = { tweets: tweets }
		render json: data.to_json
	end

end
