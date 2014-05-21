class HomeController < ApplicationController
	include ActionController::Live
=begin
  def index
		TweetStream.configure do |config|
			config.consumer_key       = ENV['CONSUMER_KEY']
			config.consumer_secret    = ENV['CONSUMER_SECRET']
			config.oauth_token        = ENV['OATH_TOKEN']
			config.oauth_token_secret = ENV['OATH_TOKEN_SECRET']
			config.auth_method        = :oauth
		end

		TweetStream::Client.new.track('term1', 'term2') do |status|
			puts "#{status.text}"
		end

		response.headers['Content-Type'] = 'text/event-stream'
    100.times {
      response.stream.write "hello world\n"
      sleep 1
		}
=end
	def events
		response.headers["Content-Type"] = "text/event-stream"
		start = Time.zone.now
		10.times do
			Tweet.uncached do
				Tweet.where('created_at > ?', start).each do |tweet|
					response.stream.write "data: #{tweet.to_json}\n\n"
					start = Time.zone.now
			  end 
			end
		end
		#sleep 2
		rescue IOError
			logger.info "Stream closed"
		ensure
			response.stream.close
		end

end
