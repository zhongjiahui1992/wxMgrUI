(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'createPictureController',
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
            function createPictureController($localStorage, $scope, $location, $log,$q, $rootScope, $window, routeService, $http) {
            
            //SHOW上传图片模态框
            $scope.uploadGraphic = function(){
				$("#imgImportBox").modal('show');
            };
            //上传附件
			$scope.fileInput = function() {
				var fd = new FormData();
				var file = document.querySelector('input[type=file]').files[0];
				console.log(file);
				fd.append('path', file);
				$http({
						method: 'POST',
						url: $localStorage.serviceUrl_L + "/mdAdministrativeRegion/importRegion",
						data: fd,
						headers: {'Content-Type': undefined},
						transformRequest: angular.identity
						})
						.success(function(res) {
						//上传成功的操作
						console.log(res);
						layer.msg("图片上传成功！");
					});
			}
			
            
            
            
            
            
            
            
            
            
            
            // 返回按钮
			$scope.back = function() {
				routeService.route(1201, true);
			}
            
            
            
            }]);
})(window, angular);


