(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'createVideoController',
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
            function createVideoController($localStorage, $scope, $location, $log,$q, $rootScope, $window, routeService, $http) {
            
            
            
            // 返回按钮
			$scope.back = function() {
				routeService.route(1201, true);
			}
            
            
            }]);
})(window, angular);


