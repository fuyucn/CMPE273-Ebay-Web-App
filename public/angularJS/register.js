
var login = angular.module('register', []);

login.controller('register', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error'
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_reg = true;

	$scope.submit = function() {
		$http({
			method : "POST",
			url : '/regUser',
			data : {
				"username" : $scope.username,
				"password" :  $scope.password,
        "firstname" : $scope.firstname,
        "lastname" : $scope.lastname,
				"location" : $scope.location
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.invalid_reg = false;
			}
			else
      {
        $scope.invalid_reg = true;
        //Making a get call to the '/redirectToHomepage' API
        window.location.assign("/");
      }

		}).error(function(error) {
			$scope.invalid_reg = false;
		});
	};
})
