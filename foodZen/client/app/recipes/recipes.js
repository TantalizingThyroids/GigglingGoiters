angular.module('foodZen.recipes', ['ngSanitize', 'ui.bootstrap'])
.controller('RecipeController', function($scope, $http, Recipes, Ingredients, $location, $anchorScroll, $timeout){
  $scope.data = {};
  $scope.singleRecipe = {};
  $scope.data.nutri = [];
  $scope.isCollapsed = true;
  $scope.isNutClps = true;
  $scope.recipeNutri = {
    'Calories':0,
    'Protein':0,
    'TotalFat':0,
    'Carbs':0,
    'Sugar':0
  };
  var currRecServ;
  var nutriList = [];
  // var env = require('../env/env.js');
  // var foodAPIkey = env.foodAPIkey;
  
  // show detailed singleRecipe when true
  $scope.singleRecipe.view = false;
  // Show saved recipes when true
  $scope.savedRecipes = false;
  $scope.spiffyGif = false;
  $scope.loaded = false;
  $anchorScroll.yOffset = 100;

   $scope.scrollTo = function (id) {
    var old = $location.hash();
    $timeout(function() {
      $location.hash(id);
      $anchorScroll();
      $location.hash(old);
    });
  };

  //Get recipes from current cart and user's saved collection
  var initializeRecipes = function(){
    $scope.spiffyGif = true;
    Recipes.updateRecipes(Ingredients.ingredients)
    .then(function (recipes) {
      $scope.spiffyGif = false;
      $scope.loaded = true;
      $scope.data.recipes = recipes;
    });

    Recipes.getUserRecipes()
    .then(function (savedRecipes) {
      $scope.data.savedRecipes = chunk(savedRecipes, 3);
      //Don't show saved recipes title header if there are no saved recipes
      if(!savedRecipes.length) {
        $scope.savedRecipes = false;
      }
      console.log('saved recipes: ', $scope.data.savedRecipes);
    });
  };

  // function for recipes view to GET user's SAVED recipes
  $scope.getUserRecipes = function() {
    Recipes.getUserRecipes()
    .then(function (savedRecipes) {
      $scope.newRecipe = false;
      $scope.savedRecipes = true;
      $scope.data.savedRecipes = chunk(savedRecipes, 3);
      $scope.scrollTo('savedRecipes');
    });
  };

  // function for recipes view to POST a recipe to user's saved recipes
  $scope.saveUserRecipe = function(recipe) {
    Recipes.postUserRecipe(recipe)
    .then(function () {
      console.log('success saving user recipe: ', recipe);
      initializeRecipes();
    }, function(err) {
      console.log('error saving user recipe');
    });
  };

  //Function to properly format and display recipe instructions
  var adjustRecipe = function(recipe) {
    var openTag = 0;
    var closeTag = 0;
    var instructions = recipe.data.instructions.split('');
    var closed = true;
    var formattedInstructions = instructions.map(function(char){
      if (char === '<') {
        closed = false;
      } else if(char === '>') {
        closed = true;
        return '*';
      } else if(closed === true) {
        return char;
      }
    }).join('').split('*').filter(function(step) {
      return step !== '';
    });
    console.log('split*', instructions.map(function(char){
      if (char === '<') {
        closed = false;
      } else if(char === '>') {
        closed = true;
        return '*';
      } else if(closed === true) {
        return char;
      }
    }).join('').split('*').filter(function(step) {
      return step !== '';
    }));
    recipe.data.instructions = formattedInstructions;
    console.log('Recipe: ', recipe);
    console.log('servings', recipe.data.servings);
    $scope.singleRecipe.recipe = recipe;
  };
  /* Function for calculating total nutrition information for 
     recipe by serving and making available to view
  */
  var totalNutri = function(nutObj, servings){
    for(var key in nutObj){
      var serving = Math.ceil(nutObj[key] / servings);
      console.log('Serving Info: ', servings);
      $scope.recipeNutri[key] += serving;
    }
  };
  //function to get a specific recipe's detailed instructions
  $scope.viewRecipe = function(id){
    return $http({
      method: 'POST',
      url: '/api/recipes/ingredients',
      data: {id: id}
    }).then(function( recipe ){
      $scope.singleRecipe.view = true;
      adjustRecipe(recipe);
      // Assing list of ingredient objects to variable
      var ingList = recipe.data.extendedIngredients;
      // Iterate through ingredient list for recipe
      ingList.forEach(function(item, i){
        // Format ingredient string into query string for API
        var ingredient = item.originalString;
        var joinTest = ingredient.split(' ');
        joinTest = joinTest.join('+');
        // Request settings for Spoonacular API to retrieve nutrition information
        var settings = {
          url: "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/visualizeNutrition",
          method: "POST",
          headers: {
            'X-Mashape-Key': 'kwMRnRx4Pdmsh3iPYU5EviI2URg2p1N6NxtjsnwJlPvXFoXn2V',
            'Content-Type': "application/x-www-form-urlencoded"
          },
          data: "defaultCss=checked&ingredientList="+joinTest+"&servings=1"
        };
        // HTTP POST request to Spoonacular API
        $http(settings)
          .then(function(nutri){
            // Extract inbound nutrition info
            var ingObj = Ingredients.nutritionExtractor(nutri);
            // Get Servings information for recipe
            var serv = $scope.singleRecipe.recipe.data.servings;
            // Calculate total nutrition for recipe, send to view
            totalNutri(ingObj, serv);
            // Add nutrition object to ingredients object for use in view
            $scope.singleRecipe.recipe.data.extendedIngredients[i].nutri = ingObj;              
          });
      });
      $scope.scrollTo('singleRecipe');
    });
  };
  initializeRecipes();

  //function to delete a user's saved recipe
  $scope.deleteUserRecipe = function(recipe){
    return $http.delete('/api/users/recipes', {params: {recipe: recipe}})
    .then(function (res) {
      initializeRecipes();
      console.log('success deleting recipe', res);
    }, function (error) {
      console.error('error with deleting recipe', error);
    });
  };

   var chunk = function (arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    return newArr;
  };

});