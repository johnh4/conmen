require 'spec_helper'

describe ConmenController do

  describe "GET 'ideology'" do
    it "returns http success" do
      get 'ideology'
      response.should be_success
    end
  end

end
