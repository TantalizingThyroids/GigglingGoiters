var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/foodZen');

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// start listening to requests on process.env.PORT or 3000
// var port = process.env.PORT || 3000;
var port = 3000;
app.listen(port);
console.log("listening on port " + port);
// export our app for testing and flexibility, required by index.js
module.exports = app;
