(function(window, angualr) {

	'use strict';
	var app = angular.module('app');
	//封面图片加载失败更换成自定义图片
	app.directive('errSrc', function() {
	    return {
	        link: function(scope, element, attrs) {
	            element.bind('error', function() {
			        if  (attrs.src != attrs.errSrc) {
			            attrs.$set('src', attrs.errSrc);
	                }
	            });
	        }
	    }
	});
	
	app.controller('detailWxUnionController', [
		'$localStorage',
		'$scope',
		'$location',
		'$log',
		'$q',
		'$rootScope',
		'globalParam',
		'$window',
		'routeService',
		'$http',
		'$state',
		function detailWxUnionController($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $state) {
			
			/**
			 * ==============================================
			 * @name 微信管理——微信联盟——项目详情
			 * @author </br>2018/07/18
			 * @version 
			 * @desc
			 * ==============================================
			 */
			
			
			$scope.init = function(){
				/*
                 *初始化类型
                 */
                $scope.type = '';
			}
			$scope.thumb = $localStorage.detailData.thumb;
			$scope.qrcode = $localStorage.detailData.qrcode;
			$scope.title = $localStorage.detailData.title;
			$scope.description = $localStorage.detailData.description;
			var picThumb  = $localStorage.serviceUrl_localgetImg + $scope.thumb;
			var picQrcode = $localStorage.serviceUrl_localgetImg + $scope.qrcode;
			$("#picThumb").attr("src", picThumb);
			$("#picQrcode").attr("src", picQrcode);
			
		    /**
		     * 返回
		     */
		    $scope.back = function(){
		    	routeService.route(1207,true);
		    }
		    
		    
		}
	]);
})(window, angular);
