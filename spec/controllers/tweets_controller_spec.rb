require 'spec_helper'

describe TweetsController do

  describe "GET 'congress'" do
    it "returns http success" do
      get 'congress'
      response.should be_success
    end
  end

end
