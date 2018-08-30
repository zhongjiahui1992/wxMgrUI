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
	
	app.controller('addWxUnionController', [
		'$localStorage',
		'$scope',
		'$location',
		'$log',
		'$q',
		'$rootScope',
		'$window',
		'routeService',
		'$http',
		'$state',
		function addWxUnionController($localStorage, $scope, $location, $log, $q, $rootScope, $window, routeService, $http, $state) {
			
			/**
			 * ==============================================
			 * @name 微信管理——微信联盟——项目新增
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
			
			/**
			 * 封面 | 二维码图片上传
			 */
			$scope.uploadFuc = function(type){
                $scope.type = type;
				$("#imgImportBox").modal('show');
			}
			
			$scope.uploadOk = function(){
				var formFile = new FormData();
				var fileObj = document.querySelector('input[type=file]').files[0];
				//文件
		        if (fileObj == null) {
		            layer.close($scope.loading);
					layer.msg("请上传图片文件！");
		            return;
		        }
		        
                formFile.append("uploadFile", fileObj);
				var data = formFile;
				$scope.loading = layer.load(3, {shade: [0.3, '#000000']});
				
				$http({
						method: 'post',
						url: $localStorage.wxunionServiceUrl + 'wxUnion/coverUpload',
						data: data,
						headers: {'Content-Type': undefined},
						transformRequest: angular.identity
						}
					).success(function(res) {
						var coverUrl,imgUrl;
						if(res.resCode === 1){
							imgUrl = res.data;
							coverUrl = $localStorage.serviceUrl_localgetImg + imgUrl;
							if($scope.type == 0){
								$("#picThumb").attr("src", coverUrl);
								$scope.type = '';
								$scope.thumb = imgUrl;
							}else{
								$("#picQrcode").attr("src", coverUrl);
								$scope.type = '';
								$scope.qrcode = imgUrl;
							}
							$('#inputImg').fileinput('reset');
							layer.msg("图片上传成功！");
							layer.close($scope.loading);
						}else{
							$('#inputImg').fileinput('reset');
							console.log("res 数据有误")
							layer.close($scope.loading);
						}
						
						//上传成功的操作
						$("#imgImportBox").modal('hide');
					}).error(function() {
						layer.close($scope.loading);
						layer.msg("图片上传失败！");
					});
			}
			
			/**
			 * 公众号描述
			 */
			$scope.countNum = 255;
		    $scope.checkText = function () {
		    	$scope.countNum = 255 - $scope.description.length;
		        if ($scope.description.length > 255) {
		            layer.alert("你好，描述字数控制在255字以内！");
		            $scope.description = $scope.description.substr(0, 255);
		            $scope.countNum = 0;
		        }
		    };
		    
		    /**
		     * 提交表单
		     */
		    var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
		    $scope.addInfo = function(){
		    	$scope.loading = layer.load(3, {shade: [0.3, '#000000']});
				
				//公众号标题
				if(!$scope.title || !jsname.test($scope.title) == null) {
					layer.close($scope.loading);//关闭加载Loading
					layer.msg("公众号标题不能为空！");
		            return;
				} 
				
            	//公众号描述
            	if(!$scope.description || !jsname.test($scope.description) == null) {
					layer.close($scope.loading);//关闭加载Loading
					layer.msg("公众号描述不能为空！");
		            return;
				}
				
            	$http({
                    method: "post",
					url: $localStorage.wxunionServiceUrl + 'wxUnion/add',
                    params: {
						title:$scope.title,
						description:$scope.description,
						thumb:$scope.thumb,
						qrcode:$scope.qrcode
                    },
                }).success(
                    function(res) {
                        console.log(res)
                        layer.msg("添加成功！");
						layer.close($scope.loading);
						$scope.clear();
                    }
                );
            	
		    }
            
            $scope.clear = function(){
				$scope.title = '';
				$scope.description = '';
				$scope.thumb = '';
				$scope.qrcode = '';
				var initUrl = '/src/img/upload.png';
				$("#picThumb").attr("src", initUrl);
				$("#picQrcode").attr("src", initUrl);
            }
		    
		    /**
		     * 返回
		     */
		    $scope.back = function(){
		    	routeService.route(1207,true);
		    }
		    
		    
		}
	]);
})(window, angular);
