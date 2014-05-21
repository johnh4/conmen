class HomeController < ApplicationController
	include ActionController::Live
	
	def events
		response.headers["Content-Type"] = "text/event-stream"
		redis = Redis.new
		redis.subscribe('tweets.create') do |on|
			puts 'in tweets create sub on'
			on.message do |event, data|
				#puts "in on.message, event: #{event}, data: #{data}"
				response.stream.write("data: #{data}\n\n")
			end
		end
		rescue IOError
			logger.info "Stream closed"
		ensure
			redis.quit
			response.stream.close
	end

end
