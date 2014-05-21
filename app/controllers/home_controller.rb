class HomeController < ApplicationController
	include ActionController::Live
	
	def index
	end
	def events

		response.headers["Content-Type"] = "text/event-stream"
		TweetStream::Client.new.track('nba') do |status|
			puts "#{status.text}"
			tweet = Tweet.create(text: status.text)
			response.stream.write("data: #{tweet.to_json}\n\n")
			#$redis.publish('tweets.create', tweet.to_json)
		end
		rescue IOError
			logger.info "Stream closed"
		ensure
			response.stream.close
=begin
			
		response.headers["Content-Type"] = "text/event-stream"
		$redis.subscribe('tweets.create') do |on|
			puts 'in tweets create sub on'
			on.message do |event, data|
				#puts "in on.message, event: #{event}, data: #{data}"
				response.stream.write("data: #{data}\n\n")
			end
		end
		rescue IOError
			logger.info "Stream closed"
		ensure
			$redis.quit
			response.stream.close
=end
	end


end
