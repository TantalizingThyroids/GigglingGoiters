// angular.module('foodZen.map', [])
// // .directive('MapController', function() {
// 	.config(function(uiGmapGoogleMapApiProvider) {
// 	    uiGmapGoogleMapApiProvider.configure({
// 	        //    key: 'your api key',
// 	        v: '3.20', //defaults to latest 3.X anyhow
// 	        libraries: 'weather,geometry,visualization'
// 	    });
// 	})
// });
angular.module("foodZen.map", [])
.controller("MapController", function($scope) {
  $scope.hitEnter = function($event, input) {
    if($event.which === 13) {
    	$scope.addInput(input);
    }
  };
});

