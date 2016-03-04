angular.module('foodZen.grocery-services', [])
.factory('Groceries', [ '$http', function ($http){

  var groceries = [];

  var getGroceryList = function() {
    return $http({
      method: 'GET',
      url: '/api/groceries'
    }).then(function (res) {
      console.log('got dem groceries');
      groceries = res.data;
      return res.data;
    }).catch(function (error) {
      console.error('error with getting groceries');
    });
  };

  //this function was written to take an array to be able to add
  //more than one grocery items at a time.  if you want to add only one
  //item, throw it in an array first plz
  var postGroceries = function(groceryArray) {
    return $http({
      method: 'POST',
      url: '/api/groceries',
      data: {groceries: groceryArray}
    }).then(function(res){
      console.log('success with the grocery post !');
    }).catch(function(error){
      console.error('error with posting groceryList');
    });
  };

  var deleteGroceries = function(grocery) {
    return $http.delete('/api/groceries', {params: {grocery: grocery}})
    .then(function(res){
      console.log('success with the grocery delete !');
    }, function(error){
      console.error('error with grocery delete');
      throw(error);
    });
  };

  var removeAllGroceries = function() {
    return $http.delete('/api/groceries')
    .then(function(res){
      console.log('success with list removal !');
    }, function(error){
      console.error('error with list removal! ');
      throw(error);
    });
  };

  var emailList = function(toEmail, list){
    return $http({
      method: 'POST',
      url: '/api/email',
      data: {to: toEmail, list: list}
    }).then(function(res){
      console.log("email post request success");
      window.alert("Email sent!");
    }, function(err){
      console.error("error with posting email request")
      throw(err);
    });
  }

  return {
    getGroceryList: getGroceryList,
    postGroceries: postGroceries,
    deleteGroceries: deleteGroceries,
    groceries: groceries,
    emailList: emailList,
    removeAllGroceries: removeAllGroceries
  };
}]);