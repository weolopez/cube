angular.module('starter.controllers', [])

  .controller('SearchCtrl', function ($scope, $firebaseObject, localStorageService, $ionicListDelegate) {
    $scope.search = {
      text: '',
      word: /^\s*\w*\s*$/
    };
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true
    $scope.date = new Date();
    var ref = new Firebase('https://whoison.firebaseio.com/cube/cubes');

    $scope.cubes = $firebaseObject(ref);
    $scope.reserve = function(item) {
      var currentUser = localStorageService.get('user');
      $scope.cubes[item.name].attid=currentUser;
      $scope.cubes.$save();
      $ionicListDelegate.closeOptionButtons();
    }

    $scope.unreserve = function(item) {
      $scope.cubes[item.name].attid='';
      $scope.cubes.$save();
      $ionicListDelegate.closeOptionButtons();
    }
    $scope.add = function () {
      var ref = new Firebase('https://whoison.firebaseio.com/cube/cubes/' + $scope.search.text);
      $firebaseObject(ref).$loaded().then(function (cube) {
        if (cube.name === undefined) {
          cube.name = $scope.search.text;
          cube.$save().then(function (ref) {
            console.log("Success?:", (ref.key() === cube.$id)); // true
          }, function (error) {
            console.log("Error:", error);
          });
        }
      })
        .catch(function (error) {
          console.log("Error:", error);
        });;
    }
  })
/*.controller('ChatsCtrl', function ($scope, $firebaseObject) {

 })

  .controller('ChatDetailCtrl', function ($scope, $stateParams) {
  })
*/
  .controller('AccountCtrl', function ($scope, $firebaseObject, localStorageService) {
    $scope.attid = {
      text: '',
      word: /^\s*\w*\s*$/
    };
    $scope.date = new Date();

    var currentUser = localStorageService.get('user');
    if (currentUser !== null) {
      var ref = new Firebase('https://whoison.firebaseio.com/cube/users/' + currentUser);
      $scope.user = $firebaseObject(ref);
    }
    $scope.find = function () {
      if ($scope.user === undefined) {
        var ref = new Firebase('https://whoison.firebaseio.com/cube/users/' + $scope.attid.text);
        $scope.user = $firebaseObject(ref).$loaded().then(function (user) {
          if (user.attid === undefined) {
            user.attid = $scope.attid.text;
            user.$save().then(function (ref) {
              console.log("Success?:", (ref.key() === user.$id)); // true
            }, function (error) {
              console.log("Error:", error);
            });
          }
          localStorageService.set('user', $scope.attid.text);
          $scope.user.attid = $scope.attid.text;
        })
          .catch(function (error) {
            console.log("Error:", error);
          });;
      }
    }

  });
