var Grocery = require('./groceryModel.js');
var helpers = require('../config/helpers.js');
var https = require('https');
var request = require('request');
var Mailgun = require('mailgun-js');
var env = require('../env/env.js')
var emailAPIkey = env.emailAPIkey;
var emailDomain = env.emailDomain;

module.exports = {

  getAllGroceries: function (email, callback) {
    Grocery.findOne( {email: email} ).exec( function( err, cart ) {
      if( err ) {
        console.error( 'Error retrieving user ingredients: ', err );
        return;
      } else {
       return callback ( cart );
      }
    });
  },

  sendGroceries: function (req, res, next) {
    var email = req.user.email;
    module.exports.getAllGroceries( email, function( cart ) {
      if( !cart ) {
        res.end('');
      } else {
        res.json(cart.groceries);
      }
    });
  },

  addGroceries: function (req, res, next) {
    var groceries = req.body.groceries;
    helpers.findUser_Groceries(req, res, next, function( found ){
      for(var i = 0; i < groceries.length; i++){
        if (found.groceries.indexOf(groceries[i]) === -1){
          found.groceries.push(groceries[i]);
        }
      }
    });
  },

  removeGroceries: function ( req, res, next ) {
    var grocery = req.query.grocery;
    helpers.findUser_Groceries(req, res, next, function( found ){
      found.groceries.splice(found.groceries.indexOf(grocery), 1);
    });
  },

  emailList: function(req, res){
    // Email Friend of User grocerylist
    var mailgun = new Mailgun({apiKey: emailAPIkey, domain: emailDomain});
    var html = 'Hello! Welcome to FoodZen!' +
      '<div>' +
      '<h2>Check out my FoodZen ingredients list!</h2>' +
      '<ul>' +
      req.body.list.map(function(e) {
        return '<li>' + e + '</li>';
      }).join('') +
      '</ul>' +
      '</div>';
    var mailData = {
      //Specify email data
      from: 'eat.food.zen@gmail.com',
      //The email to contact
      to: req.body.to,
      //Subject and text data
      subject: 'Hello from Eat.Food.Zen!!',
      html: html
    };
    mailgun.messages().send(mailData, function (err, body) {
      if (err) {
        console.log("Error sending message: ", err);
        res.status(404).end();
      } else {
        res.status(204).end();
      }
    });

  }

};
