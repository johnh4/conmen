require 'spec_helper'

describe TweetBatch do

	subject(:batch) { TweetBatch.new }

	it "should have the correct constant list url" do
		TweetBatch::LIST_URL.should eq 'https://twitter.com/cspan/members-of-congress'
	end

	context "initialization" do
		before do
			@tweet_id = 123456789
			@new_batch = TweetBatch.new(@tweet_id)
		end
		it "should allow for setting the last id" do
			@new_batch.last_id.should be @tweet_id
		end
	end

end
