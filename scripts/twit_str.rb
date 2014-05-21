puts "runner started"
TweetStream.configure do |config|
	config.consumer_key       = ENV['CONSUMER_KEY']
	config.consumer_secret    = ENV['CONSUMER_SECRET']
	config.oauth_token        = ENV['OATH_TOKEN']
	config.oauth_token_secret = ENV['OATH_TOKEN_SECRET']
	config.auth_method        = :oauth
end

TweetStream::Client.new.track('nba') do |status|
	puts "#{status.text}"
	tweet = Tweet.create(text: status.text)
	$redis.publish('tweets.create', tweet.to_json)
end
