describe("ConMen controllers", function(){

	describe("MainCtrl", function(){
		var mainCtrl, scope;

		beforeEach(function(){
			function MockCommonCon(){
				var currentChamber = "senate";
				var stateSunCons;
				var currentCon;
				var currentState;
				var sunCons = [
					{
						name: "Nancy Pelosi",
						state: "CA",
						chamber: "house"
					},
					{
						name: "John Boehner",
						state: "OH",
						chamber: "house"
					},
					{
						name: "Marco Rubio",
						state: "FL",
						chamber: "senate"
					},
					{
						name: "Bill Nelson",
						state: "FL",
						chamber: "senate"
					}
				];
				this.getSunCons = function(){
					return sunCons;
				}
				this.getCurrentChamber = function(){
					return currentChamber;
				}
				this.setChamber = function(chamber){
					currentChamber = chamber;
				}
				this.setCurrentState = function(state){
					currentState = state;
				}
				this.getCurrentState = function(){
					return currentState;
				}
				this.genStateCons = function(){
					return ["@RepPelosi", "@RepBoehner", "@SenRubio"];
				}
				this.getStateSunCons = function(){
					stateSunCons = sunCons.filter(function(sunCon){
						return sunCon.state === currentState;
					});
				}
				this.setCurrentCon = function(con){
					currentCon = con;
					currentChamer = con.chamber;
				}
				this.onlySetCurrentCon = function(con){
					currentCon = con;
					currentChamer = con.chamber;
				}
				this.getCurrentCon = function(){
					return currentCon;
				}
			}

			//module("ConMen");
			module("ConMen", function($provide){
				$provide.value('CommonCon', new MockCommonCon);
			});
		});

		beforeEach(inject(function($controller, $rootScope, _CommonCon_){
			scope = $rootScope.$new();
			CommonCon = _CommonCon_;
			mainCtrl = $controller("MainCtrl", { $scope: scope,
																					 CommonCon: CommonCon});
		}));

		it("should contain scope test", function(){
			expect(scope.test).toBe("scope test");
		});

		describe("changing views", function(){
			it("should have a default view", function(){
				expect(scope.currentView).toBe("tweets");
			});
			it("setCurrentView should be able to change the view", function(){
				scope.setCurrentView("votes");
				expect(scope.currentView).toBe("votes");
			});
			it("viewSelected should know which view is selected", function(){
				scope.setCurrentView("votes");
				expect(scope.viewSelected("votes")).toBe(true);
			});
		});

		describe("toggling the phone #", function(){
			it("showPhone should be false by default", function(){
				//scope.showPhone = false;
				expect(scope.showPhone).toBe(false);
			});
			it("togglePhone should toggle showPhone", function(){
				scope.togglePhone();
				expect(scope.showPhone).toBe(true);
			});
		});

		describe("sunCons",function(){
			it("should have sunCons", function(){
				expect(scope.sunCons()).toEqual(
					[
						{
							name: "Nancy Pelosi",
							state: "CA",
							chamber: "house"
						},
						{
							name: "John Boehner",
							state: "OH",
							chamber: "house"
						},
						{
							name: "Marco Rubio",
							state: "FL",
							chamber: "senate"
						},
						{
							name: "Bill Nelson",
							state: "FL",
							chamber: "senate"
						}
					]
				);
			});
		});

		describe("the current chamber",function(){
			// this should be a service unit test
			it("should default to the senate", function(){
				expect(scope.getCurrentChamber()).toBe("senate");
			});
			it("can be changed", function(){
				scope.setChamber("house");
				expect(scope.getCurrentChamber()).toBe("house");
			});
		});

		describe("the current state",function(){
			// this should be a service unit test
			it("can be set", function(){
				scope.setCurrentState("FL");
				expect(scope.getCurrentState()).toBe("FL");
			});
		});

		describe("getStateCongs",function(){
			// this should be a service unit test
			it("should not be null", function(){
				expect(scope.getStateCongs()).not.toBe(null);
			});
		});

		describe("stateSunCons",function(){
			// this should be a service unit test
			it("should not be null", function(){
				expect(scope.stateSunCons()).not.toBe(null);
			});
		});
	});
});
