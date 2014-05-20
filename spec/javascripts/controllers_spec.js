describe("ConMen controllers", function(){
	var mainCtrl, scope;
	beforeEach(function(){
		module("ConMen");
	});
	describe("MainCtrl", function(){
		beforeEach(inject(function($controller, $rootScope){
			scope = $rootScope.$new();
			mainCtrl = $controller("MainCtrl", { $scope: scope });
		}));
		it("should contain scope test", function(){
			expect(scope.test).toBe("scope test");
		});
	});
	it("should pass true is true", function(){
		expect(true).toBe(true);
	});
});
/*
describe "Restauranteur controllers", ->
  beforeEach module("restauranteur")

  describe "RestaurantIndexCtrl", ->
    it "should set restaurants to an empty array", inject(($controller) ->
      scope = {}
      ctrl = $controller("RestaurantIndexCtrl",
        $scope: scope
      )
      expect(scope.restaurants.length).toBe 0
    )
*/
