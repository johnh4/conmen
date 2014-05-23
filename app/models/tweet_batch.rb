class TweetBatch
	attr_accessor :last_id
	LIST_URL = 'https://twitter.com/cspan/members-of-congress'

	def initialize(last_id = nil)
		@last_id = last_id
	end

	def all_tweets
		tweets = get_tweets
		data = { tweets: tweets, last_id: latest_id(tweets) }
		puts "tweets[0][:id]: #{tweets[0][:id]}"
		puts "lastest_id(tweets): #{latest_id(tweets)}"
		data
	end

	def new_tweets
		tweets = get_tweets
		#calc last id
		new_last_id = tweets.empty? ? last_id : latest_id(tweets)
		#build data obj
		data = { tweets: tweets , last_id: new_last_id }
		puts "lastest_id(tweets): #{latest_id(tweets)}" unless tweets.empty?
		data
	end


		def latest_id(tweets)
			tweets.max_by { |t| t[:id].to_i  }[:id] unless tweets.empty?
		end

		def build_tweets(listed_tweets)
			#extract the information that we want, return array of tweets
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
				unless @last_id == tweet.id
					puts "last_id: #{@last_id}"
					puts "tweet.id: #{tweet.id}"
					puts "tweet.text: #{tweet.text}"
					tweets << new_tweet
				end
			end
			tweets
		end

		def get_tweets
			#get tweets from list
			list = URI.parse(LIST_URL)
			#only get tweets since last tweet if this is a refresh
			if @last_id
				listed_tweets = $client.list_timeline(list, since_id: @last_id.to_i)
			else
				listed_tweets = $client.list_timeline(list)
			end
			puts listed_tweets.inspect
			build_tweets(listed_tweets)
		end

end
