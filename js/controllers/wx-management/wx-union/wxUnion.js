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
	
	app.controller('wxUnionController', [
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
		function wxUnionController($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $state) {
			
			/**
			 * ==============================================
			 * @name 微信管理——微信联盟
			 * @author </br>2018/07/18
			 * @version 
			 * @desc
			 * ==============================================
			 */
			
			
			$scope.init = function(){
				/*
                 *初始化
                 */
				$scope.httpUrl = $localStorage.serviceUrl_localgetImg;
			}
			
			/**
			 * 项目新增
			 */
			$scope.goAddPage = function(){
            	routeService.route(12046, false);
			}
			
			/**
			 * 项目详情
			 */
			$scope.allianceView = function(id){
				$http({
					url: $localStorage.wxunionServiceUrl + "/wxUnion/detail",
					method: "get",
					params: {
						id: id
					}
				}).success(function success(res) {
					globalParam.setter(res)
					$localStorage.detailData = globalParam.getter().data;
					console.log(res);
					routeService.route(12048, false);
				});
			}
			
			/**
			 * 项目编辑
			 */
			$scope.allianceEdit = function(id){
				$http({
					url: $localStorage.wxunionServiceUrl + "/wxUnion/detail",
					method: "get",
					params: {
						id: id
					}
				}).success(function success(res) {
					globalParam.setter(res)
					$localStorage.editData = globalParam.getter().data;
					console.log(res);
					routeService.route(12047, false);
				});
			}
			
			/**
			 * 列表数据
			 */
			
			var reGetProduct = function() {
                $http({
                    method: "GET",
					url: $localStorage.wxunionServiceUrl + 'wxUnion/list',
                    params:{
                        page:$scope.paginationConf.currentPage,
                        size:$scope.paginationConf.itemsPerPage
                    }
                }).success(
                    function(res) {
                    	console.log(res)
                        if(res.resCode == 1){
                            $scope.allianceData = res.data.list;
                            $scope.paginationConf.totalItems = res.data.total;
                           
                            setTimeout(function(){
	                            //调用示例
								layer.photos({
								  photos: '.layer-photos'
								  ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
								  ,shift:-1
								}); 
                            },0)
                        }else{
                        }
                    }
                ).error(function() {});
            };
            
            $scope.paginationConf = {
                currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                itemsPerPage: 10,
                pagesLength: 5,
                perPageOptions: [1, 2, 3, 4, 5, 10],
                onChange: function() {
                    $location.search('currentPage', $scope.paginationConf.currentPage);
                }
            };
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProduct);
			
			/**
			 * 删除数据
			 */
			$scope.allianceDelete = function(id){
				
				var layerIndex = layer.confirm('确定删除本条数据吗？', {
	                btn : [ '确定', '取消' ]
	            }, function() {
	            	
	            	$http({
						method:"post",
						url:$localStorage.wxunionServiceUrl + 'wxUnion/delete',
						params:{
							id:id
						}
					}).success(
						function(res){
							console.log(res);
							if(res.resCode ===1 ){
								reGetProduct();
								layer.msg("删除成功")
							}
						}
					).error(function(){
						console.log("获取数据失败")
	                	layer.alert("删除失败！")
					})
	            	
	                layer.close(layerIndex);
	            }, function() {
	
	            });
				
			}
			
			
		}
	]);
})(window, angular);
