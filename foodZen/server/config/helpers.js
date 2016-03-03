var jwt = require('jwt-simple');
var Ingredient = require('../ingredients/ingredientModel.js');
var User_Recipe = require('../user_recipe/user_recipeModel.js');
var Grocery = require('../groceries/groceryModel.js');


module.exports = {
  errorLogger: function (error, req, res, next) {
    // log the error then send it to the next middleware in
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.send(500, {error: error.message});
  },

  decode: function (req, res, next) {
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      return res.send(403); // send forbidden if a token is not provided
    }

    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
  },

  findUser: function ( req, res, next, callback ) {
    var ingredient = req.body.ingredient;
    var email = req.user.email;
    Ingredient.findOne({email: email}).exec(function( err, found) {
      if( found ) {
        callback ( found );
        found.save(function( err, found ) {
          if( err ) {
            console.error( 'Error interacting with ingredient, ', err);
            res.send(500);
          } else {
            console.log('successfully acted upon ingredient: ', found);
            res.send(200, found);
          }
        });
      } else {
        var newIngredient =  new Ingredient({
          email: email,
          ingredients: [ingredient]
        });
        newIngredient.save(function(err, newUser){
          if( err ) {
            res.send( 500, err );
          } else {
            console.log('new user created in Ingredients db', newUser);
            res.send(200, newUser);
          }
        });
      }
    });
  },

  findUser_Groceries: function ( req, res, next, callback ) {
    var groceries = req.body.groceries;
    var email = req.user.email;
    Grocery.findOne({email: email}).exec(function( err, found) {
      if( found ) {
        callback ( found );
        found.save(function( err, found ) {
          if( err ) {
            console.error( 'Error interacting with grocery, ', err);
            res.send(500);
          } else {
            console.log('successfully acted upon grocery: ', found);
            res.send(200, found);
          }
        });
      } else {
        var newGrocery =  new Grocery({
          email: email,
          groceries: groceries
        });
        newGrocery.save(function(err, newUser){
          if( err ) {
            res.send( 500, err );
          } else {
            console.log('new user created in Groceries db', newUser);
            res.send(200, newUser);
          }
        });
      }
    });
  },

  findUser_Recipes: function ( req, res, next, callback ){
    var email = req.user.email;
    User_Recipe.findOne({email: email}).exec(function( err, found) {
      if( found ) {
        callback ( found );

      } else {
        var newIngredient =  new Ingredient({
          email: email,
          ingredients: [ingredient]
        });
        newIngredient.save(function(err, newUser){
          if( err ) {
            res.send( 500, err );
          } else {
            console.log('new user created in Ingredients db', newUser);
            res.send(200, newUser);
          }
        });
      }
    });
  }
};
