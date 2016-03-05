angular.module('foodZen.ingredients', ['ui.bootstrap'])

.controller('IngredientController', function($scope, $http, $location, Ingredients, Auth, Recipes, Baskets, $anchorScroll, $timeout){

  $scope.ingredientList = false;
  $scope.defaultCarts = false;
  $anchorScroll.yOffset = 100;
  $scope.ingredientAdded = false;
  $scope.newIngredient = '';
  
  var timeOfLastAdd;

  $scope.showDefaultCarts = function(id) {
    $scope.defaultCarts = !$scope.defaultCarts;
    console.log('scope default carts', $scope.defaultCarts);
    if($scope.defaultCarts) {
      $scope.scrollTo(id);
    }
  };

  $scope.showIngredients = function(id) {
    $scope.ingredientList = !$scope.ingredientList;
    console.log('scope ingredients show', $scope.ingredientList);
    if($scope.ingredientList) {
      $scope.scrollTo(id);
    }
  };

   $scope.scrollTo = function (id) {
    var old = $location.hash();
    $timeout(function() {
      $location.hash(id);
      $anchorScroll();
      $location.hash(old);
    });
  };

  var initializeIngredients = function(){
      Ingredients.getIngredients()
      .then(function (ingredients) {
        $scope.chunkedData = chunk(ingredients, 3);
      });
  };

  var displayIngredientMessage = function (ingredient) {
    $scope.newIngredient = ingredient;
    $scope.ingredientAdded = true;
  };

  var expireIngredientMessage = function (milliseconds) {
    setTimeout(function() {
      $scope.$apply(function() {
        if ($scope.ingredientAdded === true && (Date.now() - timeOfLastAdd >= milliseconds)) {
          $scope.ingredientAdded = false;
        }
      });
    }, milliseconds);
  };

  $scope.hitEnter = function($event, ingredient) {
    if($event.which === 13) {
      $scope.addIngredient(ingredient);
    }
  };

  $scope.addIngredient = function(ingredient) {
    Ingredients.postIngredient(ingredient, function () {
      initializeIngredients();
    });
    $scope.ingredient = '';
    timeOfLastAdd = Date.now();
    displayIngredientMessage(ingredient);
    expireIngredientMessage(3000);
  };

  $scope.removeIngredient = function(ingredient) {
    Ingredients.deleteIngredient(ingredient, function () {
      initializeIngredients();
    });
  };

  $scope.goRecipes = function() {
    $location.url('/recipes');
  };

  $scope.signout = function () {
    //google sign out
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    //foodZen sign out
    Auth.signout();
  };

  var chunk = function (arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    return newArr;
  };

  $scope.baskets = Baskets.baskets;

  $scope.addBasket = function (basket) {
    // console.log("You added the basket:", basket.name);
    var contents = basket.contents;
    // console.log("This basket contains:", contents);
    for (var i = 0; i < contents.length; i++) {
      $scope.addIngredient(contents[i]);
    }
  };

  initializeIngredients();
});