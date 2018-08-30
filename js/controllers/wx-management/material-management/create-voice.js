(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'createVoiceController',
        [
            '$localStorage',
            '$scope',
            '$location',
            '$log',
            '$q',
            '$rootScope',
            '$window',
            'routeService',
            '$http',
            function createVoiceController($localStorage, $scope, $location, $log,$q, $rootScope, $window, routeService, $http) {
            
            
            
            // 返回按钮
			$scope.back = function() {
				routeService.route(1201, true);
			}
            
            
            }]);
})(window, angular);


