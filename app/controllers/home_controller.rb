class HomeController < ApplicationController
	
	def index
	end

	def events
	end

	def all_tweets
		tweets = get_tweets	
		data = { tweets: tweets, last_id: latest_id(tweets) }
		puts "tweets[0][:id]: #{tweets[0][:id]}"
		puts "lastest_id(tweets): #{latest_id(tweets)}"
		render json: data.to_json

	end

	def refresh_tweets
		tweets = get_tweets(params[:last_id])
		new_last_id = tweets.empty? ? params[:last_id] : latest_id(tweets)
		data = { tweets: tweets , last_id: new_last_id }
		puts "lastest_id(tweets): #{latest_id(tweets)}" unless tweets.empty?
		render json: data.to_json
	end
	
	private

		def get_tweets(last_id = nil)
			#get tweets from list
			url = 'https://twitter.com/cspan/members-of-congress'
			list = URI.parse(url)
			#only get tweets since last tweet if this is a refresh
			if last_id
				listed_tweets = $client.list_timeline(list, since_id: last_id.to_i)
			else
				listed_tweets = $client.list_timeline(list)
			end
			
			#extract the information that we want
			tweets = []
			listed_tweets.each do |tweet|
				new_tweet = {}
				#store ids as strings bc they're too big for js
				new_tweet[:id] = tweet.id.to_s
				new_tweet[:name] = tweet.user.name
				new_tweet[:screen_name] = tweet.user.screen_name
				new_tweet[:text] = tweet.text
				new_tweet[:created_at] = tweet.created_at
				new_tweet[:profile_image_url] = tweet.user.profile_image_uri
				new_tweet[:profile_background_image_url] = 
								tweet.user.profile_background_image_url
				new_tweet[:retweet] = tweet.retweet?
				new_tweet[:media] = tweet.media if tweet.media?
				unless last_id == tweet.id
					puts "last_id: #{last_id}"
					puts "tweet.id: #{tweet.id}"
					puts "tweet.text: #{tweet.text}"
					tweets << new_tweet
				end
			end
			tweets
		end
		
		def latest_id(tweets)
			tweets.max_by { |t| t[:id].to_i  }[:id] unless tweets.empty?
			#result = Bignum.new
		end
end
