puts "initializing tweetstream configuration"
TweetStream.configure do |config|
	config.consumer_key       = ENV['CONSUMER_KEY']
	config.consumer_secret    = ENV['CONSUMER_SECRET']
	config.oauth_token        = ENV['OATH_TOKEN']
	config.oauth_token_secret = ENV['OATH_TOKEN_SECRET']
	config.auth_method        = :oauth
end
