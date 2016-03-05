angular.module("foodZen.map", [])

.controller("MapController", function($scope, $sce) {
  $scope.query;
  $scope.url = $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/search?q=store&key=AIzaSyCYdI-lgb1JRIBP0dPdqsfIBe-slSQU4AI');

  $scope.hitEnter = function($event, input) {
    if($event.which === 13) {
    $scope.submitQuery(input);
  	}
  };

  $scope.submitQuery = function() {
    $scope.url = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/search?q=" + $scope.query + "&key=AIzaSyCYdI-lgb1JRIBP0dPdqsfIBe-slSQU4AI");
  	// console.log("You are requesting this url: ", $scope.url)
	$scope.query = '';
	};
});

