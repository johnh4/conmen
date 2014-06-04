class TweetBatch
	attr_accessor :last_id
	MAX_QUERY_SIZE = 12
	COUNT = 30
	LIST_URL = 'https://twitter.com/cspan/members-of-congress'

	def initialize(last_id = nil, state = nil)
		@last_id = last_id
		@state_congs = state
		@options = {}
		@options[:count] = COUNT
		@options[:since_id] = @last_id if @last_id
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
			if needs_batches
				puts "in above max q size condition"
				listed_tweets.each do |set|
					construct_tweets(set, tweets)
				end
				sort_tweets(tweets)
			else
				construct_tweets(listed_tweets, tweets)
			end
			tweets.take(30)
		end

		def needs_batches
			@state_congs && @state_congs.split(",").length > MAX_QUERY_SIZE
		end
		def sort_tweets(tweets)
			tweets.sort! { |a,b| b[:id] <=> a[:id] }
		end

		def construct_tweets(listed_tweets, tweets)
			listed_tweets.each do |tweet|
				new_tweet = {}
				#store ids as strings bc they're too big for js
				new_tweet[:id] = tweet.id.to_s
				new_tweet[:name] = tweet.user.name
				new_tweet[:screen_name] = tweet.user.screen_name
				new_tweet[:text] = tweet.text
				new_tweet[:created_at] = tweet.created_at
				if tweet.user.profile_image_url
					new_tweet[:profile_image_url] = tweet.user.profile_image_uri
				end
				if tweet.user.profile_background_image_url
					new_tweet[:profile_background_image_url] = 
									tweet.user.profile_background_image_url
				end
				new_tweet[:retweet] = tweet.retweet?
				new_tweet[:media] = tweet.media if tweet.media?
				unless @last_id == tweet.id
					puts "last_id: #{@last_id}"
					puts "tweet.id: #{tweet.id}"
					puts "tweet.text: #{tweet.text}"
					tweets << new_tweet
				end
			end
		end

		def get_tweets
			#listed_tweets = get_list
			listed_tweets = @state_congs ? get_state_list : get_list 
			build_tweets(listed_tweets)
		end

		def get_list
			#get tweets from list
			list = URI.parse(LIST_URL)
			puts "@options: #{@options}"
			listed_tweets = $client.list_timeline(list, @options)
			puts "listed_tweets.inspect: #{listed_tweets.inspect}"
			listed_tweets
		end

		def tweets_from_batches(state_q)
			tweets = []
			state_q.each_slice(MAX_QUERY_SIZE) do |slice|
				puts "slice: #{slice}"
				state_q_string = state_query_string(slice.join(","))
				tweets << $client.search(state_q_string, @options)
			end
			puts "tweets.length: #{tweets.length}"
			puts "tweets: #{tweets}"
			tweets
		end

		def get_state_list
			#separate state_q into batches
			state_q = @state_congs.split(",")
			if state_q.length > MAX_QUERY_SIZE
				tweets = tweets_from_batches(state_q)
			else
				#generate tweets from each batch
				#combine tweet batches, sort by id
				state_q = state_query_string
				puts "state_q: #{state_q}"
				listed_tweets = $client.search(state_q, @options)
				puts "listed_tweets: #{listed_tweets}"
				#puts "listed_tweets.inspect: #{listed_tweets.inspect}"
				listed_tweets
			end
		end

		def state_query_string(state_congs = @state_congs)
			state_q = state_congs.split(",")
			puts "state_q: #{state_q}"
			state_q = state_q.map { |con| "from:" + con } 
			state_q = state_q.join("+OR+")
		end
end
