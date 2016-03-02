angular.module('foodZen', ['foodZen.ingredients',
  'foodZen.auth',
  'foodZen.recipes',
  'foodZen.services',
  'foodZen.auth-services',
  'foodZen.groceries',
  'foodZen.map',
  'foodZen.grocery-services',
  'ngRoute',
  'checklist-model'])

.config(function($routeProvider, $httpProvider){
  $routeProvider
  .when('/ingredients', {
    templateUrl: 'app/ingredients/ingredients.html',
    controller: 'IngredientController',
    authenticate: true
  })
  .when('/recipes', {
    templateUrl: 'app/recipes/recipes.html',
    controller: 'RecipeController',
    authenticate: true
  })
  .when('/grocery', {
    templateUrl: 'app/grocery/grocery.html',
    controller: 'GroceryController',
    authenticate: true
  })
  .when('/', {
    templateUrl: 'app/ingredients/ingredients.html',
    controller: 'IngredientController',
    authenticate: true
  })
   .when('/signin', {
    templateUrl: 'app/auth/signin.html',
    controller: 'AuthController'
  })
  .when('/signup', {
    templateUrl: 'app/auth/signup.html',
    controller: 'AuthController'
  })
  .when('/map', {
    templateUrl: 'app/map/map.html',
    controller: 'MapController',
    authenticate: true
  })
  .otherwise({
    redirectTo: '/ingredients'
  });

    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.foodZen');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});