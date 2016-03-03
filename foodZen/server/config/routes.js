var ingredientController = require('../ingredients/ingredientController.js');
var recipeController = require('../recipes/recipeController.js');
var userController = require('../users/userController.js');
var groceryController = require('../groceries/groceryController.js');

var helpers = require('./helpers.js');

module.exports = function (app, express) {

  //Interact with Recipes
  app.get('/api/recipes/', helpers.decode, recipeController.getRecipes);
  app.get('/api/users/recipes/', helpers.decode, recipeController.getSavedRecipes);
  app.post('/api/users/recipes/', helpers.decode, recipeController.saveRecipe);
  app.post('/api/recipes/ingredients/', recipeController.getRecipeDetails);
  app.delete('/api/users/recipes', helpers.decode, recipeController.deleteUserRecipe);

  //Interact with Ingredients
  app.post('/api/ingredients/', helpers.decode, ingredientController.addIngredient);
  app.delete('/api/ingredients/', helpers.decode, ingredientController.removeIngredient);
  app.get('/api/ingredients/', helpers.decode, ingredientController.sendIngredients);

  //Interact with Users
  //app.post('/api/users/', userController.addUser);
  app.post('/api/users/signin/', userController.signin);
  app.post('/api/users/signup/', userController.signup);

  //Interact with Groceries
  app.post('/api/groceries/', helpers.decode, groceryController.addGroceries);
  app.delete('/api/groceries/', helpers.decode, groceryController.removeGroceries);
  app.get('/api/groceries/', helpers.decode, groceryController.sendGroceries);

  //Email grocery list
  app.post('/api/email/', helpers.decode, groceryController.emailList);

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
