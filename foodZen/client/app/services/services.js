angular.module('foodZen.services', [])
.factory('Recipes', [ '$http', function ($http){

  var recipes = [];

  var updateRecipes = function(IngredientArray) {
    return $http({
      method: 'GET',
      url: '/api/recipes',
      data: IngredientArray
    }).then(function (res) {
      recipes = res.data;
      console.log('got dem recipes ', recipes);
      return res.data;
    }, function (error) {
      console.error('error with getting recipes');
    });
  };

  var getRecipes = function (){
    return recipes;
  };

  // GET user's saved recipes from database
  var getUserRecipes = function() {
    return $http({
      method: 'GET',
      url: 'api/users/recipes'
    }).then(function (res) {
      console.log('success with getting user recipes');
      return res.data;
    }, function() {
      console.error('error with getting user recipes');
    });
  };

  // POST recipe to user's saved recipes
  var postUserRecipe = function(recipe) {
    return $http({
      method: 'POST',
      url: '/api/users/recipes',
      data: {recipe: recipe}
    }).then(function (res) {
      console.log('success with user recipe post');
    }, function(error) {
      console.error('error with posting user recipe');
    });
  };

  var viewRecipe = function(id){
    return $http({
      method: 'POST',
      url: '/api/recipes/ingredients',
      data: {id: id}
    }).then(function( recipe ){
      //callback(recipe);
      console.log('got recipe details', recipe);
      return recipe;
    }, function(error) {
      console.error('error with recipe details');
    });
  };

  return {
    getRecipes: getRecipes,
    updateRecipes: updateRecipes,
    recipes: recipes,
    getUserRecipes: getUserRecipes,
    postUserRecipe: postUserRecipe,
    viewRecipe: viewRecipe
  };
}])


.factory('Ingredients', [ '$http', function ($http){

  var ingredients = [];

  var postIngredient = function(ingredient, callback) {
    return $http({
      method: 'POST',
      url: '/api/ingredients',
      data: {ingredient: ingredient}
    }).then(function(res){
      if(!ingredients){
        ingredients = [];
      }
      ingredients.push(ingredient);
      console.log('success with the ingredient post !');
      callback();
    }, function(error){
      console.error('error with posting ingredient');
    });
  };

  var getIngredients = function() {
    return $http({
      method: 'GET',
      url: '/api/ingredients',
    }).then(function(res){
      ingredients = res.data;
      console.log('success with getting ingredients !', ingredients);
      return res.data;
    }, function(error){
      console.error('error with getting ingredients');
    });
  };

  var deleteIngredient = function(ingredient, callback) {
    return $http.delete('/api/ingredients', {params: {ingredient: ingredient}})
    .then(function (res) {
      console.log('success delete ingredient');
      callback();
    }, function (error) {
      console.error('error with deleting recipes');
    });
  };

  var deleteUserRecipe = function(recipe) {
    return $http.delete('/api/users/recipes', {params: {recipe: recipe}})
    .then(function (res) {
      console.log('success deleting recipe');
    }, function (error) {
      console.error('error with deleting recipe');
    });
  };

  /* Function to Extract Nutrition information from inbound XML
     and put into an object */
  var nutritionExtractor = function(xmlBlob) {
    function RemoveHTMLTags(input) {
      var regX = /(<([^>]+)>)/ig;
      var html = input;
      var stripped = html.replace(regX, " ");
      return stripped;
    }
    var tiddl = RemoveHTMLTags(xmlBlob.data);
    tiddl = tiddl.split(' ');

    var finalStr = [];
    tiddl.forEach(function(item, index){
      if(item !== ""){
        finalStr.push(item);
      }
    });
    finalStr.shift();
    var trueFinal = finalStr.slice(0,112);
    trueFinal[5] = trueFinal[5].concat(trueFinal[6]);
    trueFinal.splice(6, 1);
    // console.log("Nutrition String: ", trueFinal);
    // var nutriObj = {
    //   'Calories':-1,
    //   'Protein':-1,
    //   'TotalFat':-1,
    //   'Carbs':-1,
    //   'Sugar':-1
    // };
    // trueFinal.forEach(function(item, index){
    //   // console.log(index);
    //   if(!!nutriObj[item]){
    //     console.log('Item in Object!');
    //     if((trueFinal[index-1] !== null) && (nutriObj[item] !== -1)){
    //       console.log('Value found!!', trueFinal[index-1]);
    //       nutriObj[item] = trueFinal[index-1];
    //     }
    //   }
      // console.log('nutriObj!?? : ', nutriObj[item]);
    // });
    var nutriObj = {
      'Calories':trueFinal[0],
      'Protein':trueFinal[2],
      'TotalFat':trueFinal[4],
      'Carbs':trueFinal[6],
      'Sugar':trueFinal[24]

    };
    var finalFinal = [];
    for(var item in nutriObj){
      if(!isNaN(parseInt(nutriObj[item]))){
        nutriObj[item] = parseInt(nutriObj[item]);
      } else {
        console.log('Item???? ', item);
        nutriObj[item] = 0;
      }
    }
    // console.log('Final Final!!!!!! ', finalFinal);
    return nutriObj;
  };

  return {
    postIngredient: postIngredient,
    deleteIngredient: deleteIngredient,
    ingredients: ingredients,
    getIngredients: getIngredients,
    deleteUserRecipe: deleteUserRecipe,
    nutritionExtractor: nutritionExtractor
  };
}])


.factory('Baskets', [ '$http', function ($http){

  var baskets = {
    basics: {
      name: "Basics",
      contents: [
        "water",
        "salt",
        "pepper",
        "oil",
        "butter",
        "flour",
        "sugar"
      ]
    },
    chineseStaples: {
      name: "Chinese staples",
      contents: [
        "soy sauce",
        "sesame oil",
        "black vinegar",
        "chili sauce",
        "white rice",
        "noodles",
        "ginger",
        "scallion"
      ]
    },
    italianStaples: {
      name: "Italian staples",
      contents: [
        "extra virgin olive oil",
        "balsamic vinegar",
        "mozzarella",
        "tomatoes",
        "pasta",
        "garlic"
      ]
    }
  };
  

  return {
    baskets: baskets,
  };
}]);

