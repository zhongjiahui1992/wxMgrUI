(function(window, angular) {
	'use strict';
	angular.module("app").controller(
		'materialManagementController', [
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
			'$sce',
			'$filter',
			function materialManagementController($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,$sce,$filter) {
				//Tab标签
				$scope.activeTab = function(){
					$scope.activeTab = 'graphic';
					$scope.focus('get_materials_news','graphic');
				};
				
				$scope.localgetImg = $localStorage.serviceUrl_localgetImg;
				$scope.onlinegetImg = $localStorage.serviceUrl_onlinegetImg;
	            //更改要聚焦的tabs
	            $scope.focus=function(a,b){
	            	if(b =='graphic' ){
	          			$scope.paginationShow = false;
	            	}else{
	            		$scope.paginationShow = true;
	            	}
	            	$localStorage.t = a;
	            	$localStorage.h = b;
	            	$scope.activeTab = b;
	          		//获取图文列表
					reGetProducts(a,b);
            	}
            	var reGetProducts = function(type,materialtype) {
            		if(materialtype == 'graphic'){
            			$http({
						url: $localStorage.serviceUrl + type,
						method: 'GET',
						params: {
							materialtype:materialtype
						},
					}).success(
						function(resp) {
							if(resp.data =='' ){
								$scope.itemList = [];
								$scope.dataTips = true;
							}else{
								$scope.dataTips = false;
								$scope.itemList = resp.data;
								console.log($scope.itemList)
							}
						}).error(function(error) {});
					}else{
						$http({
							url: $localStorage.serviceUrl + type,
							method: 'GET',
							params: {
								materialtype:materialtype,
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							},
						}).success(
							function(resp) {
								console.log(resp)
								if(resp.data.resCode == 1004){
									$scope.itemList = [];
									layer.msg("暂无数据！");
								}else{
									$scope.paginationConf.totalItems = resp.data.total;
									$scope.itemList = resp.data.list;
								}
							}).error(function(error) {});
					}
            		
				};
				
				// 配置分页基本参数
				$scope.paginationConf = {
					currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
					itemsPerPage: 10,
					pagesLength: 5,
					perPageOptions: [1, 2, 3, 4, 5, 10],
					onChange: function() {
						$location.search('currentPage', $scope.paginationConf.currentPage);
					}
				};
				
				// 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
				$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',function(){
					reGetProducts($localStorage.t,$localStorage.h)
				});
				
				//******上传图片模块******
	            $scope.uploadPicture = function(){
					$("#imgImportBox").modal('show');
	            };
				
				//上传图片
				$scope.uploadOk = function() {
					$scope._load = layer.load(3, {shade: [0.3, '#000000']});
					
			        
					var formFile = new FormData();
					var fileObj = document.querySelector('input[type=file]').files[0];
					console.log(fileObj)
					//文件
			        if (fileObj == null) {
			            layer.close($scope._load);//关闭加载Loading
						layer.msg("请上传图片文件！");
			            return;
			        }
	                formFile.append("uploadFile", fileObj); //加入文件对象
					var data = formFile;
					console.log(data)
					$scope._load = layer.load(3, {shade: [0.3, '#000000']});
					$http({
							method: 'post',
							url: $localStorage.serviceUrl + 'upload_material',
							data: data,
							headers: {'Content-Type': undefined},
							transformRequest: angular.identity
							}
						).success(function(res) {
							layer.close($scope._load);//关闭加载Loading
							layer.msg("图片上传成功！");
							//上传成功的操作
							$("#imgImportBox").modal('hide');
							reGetProducts($localStorage.t,$localStorage.h)
						});
				}
				
				//******上传音频模块******
	            $scope.uploadVoice = function(){
					$("#voiceImportBox").modal('show');
	            };
	            //上传音频
	            var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
	            $scope.voiceSubmit = function() {
					$scope._load = layer.load(3, {shade: [0.3, '#000000']});
					
					var formFile = new FormData();
					var fileObj = document.querySelector('input[id=input-voice]').files[0];
	            	
	            	//标题
	            	if(!$scope.voiceTitle || !jsname.test($scope.voiceTitle) == null) {
						layer.close($scope._load);//关闭加载Loading
						layer.msg("标题不能为空！");
			            return;
					} 
	            	//文件
			        if (fileObj == null) {
			            layer.close($scope._load);//关闭加载Loading
						layer.msg("请上传音频文件！");
			            return;
			        }
	                formFile.append("uploadFile", fileObj); //加入文件对象
					var data = formFile;
					$http({
							method: 'post',
							url: $localStorage.serviceUrl + 'upload_material',
							data: data,
							headers: {'Content-Type': undefined},
							transformRequest: angular.identity
							}
						).success(function(res) {
							console.log(res);
							layer.close($scope._load);//关闭加载Loading
							layer.msg("音频上传成功！");
							//上传成功的操作
							$("#voiceImportBox").modal('hide');
							reGetProducts($localStorage.t,$localStorage.h)
						});
				}
				
				
				//******上传视频模块******
	            $scope.uploadVideo = function(){
					$("#videoImportBox").modal('show');
	            };
	            //上传附件
				$scope.videoSubmit = function() {
					$scope._load = layer.load(3, {shade: [0.3, '#000000']});
					
					//标题
	            	if(!$scope.videoTitle || !jsname.test($scope.videoTitle) == null) {
						layer.close($scope._load);//关闭加载Loading
						layer.msg("标题不能为空！");
			            return;
					} 
					
					//简介
					if(!$scope.videoDsc || !jsname.test($scope.videoDsc) == null) {
						layer.close($scope._load);//关闭加载Loading
						layer.msg("简介不能为空！");
			            return;
					} 
					
	            	//文件
	            	var fileObj = document.querySelector('input[id=input-video]').files[0];
			        if (fileObj == null) {
			            layer.close($scope._load);//关闭加载Loading
						layer.msg("请上传视频文件！");
			            return;
			        }
					$http({
							method: 'post',
							url: $localStorage.serviceUrl + 'upload_material',
							headers: {
								'Content-Type': undefined
							},
							transformRequest: function(data) {
							    var formFile = new FormData();
								var fileObj = document.querySelector('input[id=input-video]').files[0];
								console.log(fileObj);
						        formFile.append('uploadFile',fileObj);
						        formFile.append('title', data.adata);
						        formFile.append('desc', data.adesc);
						        return formFile;
						        console.log(formFile);
						   },
							data: {
						        adata: $scope.videoTitle,
						        adesc: $scope.videoDsc
						   }
						 }).success(function(res) {
							console.log(res);
							layer.msg("视频上传成功！");
							layer.close($scope._load);//关闭加载Loading
							//上传成功的操作
							$("#videoImportBox").modal('hide');
							reGetProducts($localStorage.t,$localStorage.h)
						}).error(function(){ });
				}
				
				//下载文件
				$scope.downloadFile = function(id,name){
					$http({
						method: 'post',
						url: $localStorage.serviceUrl + 'download_material',
						params:{
							mediaid:id,
							filename:name
						},
						headers: {'Content-Type': undefined},
						transformRequest: angular.identity
						}
					).success(function(res) {
						console.log(res);
						console.log(res.data);
						$scope.downloadurl = res.data;
							console.log($scope.downloadurl)
					        var objectUrl = $scope.localgetImg+$scope.downloadurl;
					        console.log(objectUrl);
					        var aFile= $("<a target='_blank'><span class='aFile'>Download</span></a>").attr("href",objectUrl);
					        console.log(aFile);
					        $("body").append(aFile);
					        $(".aFile").click();
					        aFile.remove();
					});
				}
				
            	//删除文件
				$scope.materialDel = function(id){
					console.log(id)
					var layerIndex = layer.confirm('确定删除该条数据吗？', {
						btn: ['确定', '取消']
						// 按钮
					}, function() {
						$http({
							method: 'get',
							url: $localStorage.serviceUrl + 'delete_material',
							params:{  
		                     	mediaid:id
		                    }
						}).success(function success(result) {
							console.log(result);
							layer.msg('删除成功！',{time:2000});
							reGetProducts($localStorage.t,$localStorage.h)
						}, function failure(result) {
						});
						layer.close(layerIndex);
					}, function() {

					});
				};
            	
            	//新建图文消息
				$scope.createGraphic = function() {
					routeService.route(12011, false);
				};
            	$scope.back = function() {
					routeService.route(56, true);
				}
            	
            	//编辑图文消息
            	$scope.graphicEdit = function(id){
            		console.log(id)
            		$http({
						method: 'post',
						url: $localStorage.serviceUrl + 'get_one_news',
						params:{  
	                     	newsMediaId:id
	                    }
					}).success(function success(result) {
						if(result.resCode==1){
							globalParam.setter(result)
							console.log(result);
							console.log(id);
							routeService.route(12044, false);
						}else{
							layer.msg(result.resMsg,{time:2000});
						}
					}, function failure(result) {
					});
            	}
            	/*图文瀑布流开始*/
				$(function() {
					var container = $('.waterfull ul');
					var loading = $('#imloading');
					// 初始化loading状态
					loading.data("on", true);
					/*判断瀑布流最大布局宽度，最大为1280*/
					function tores() {
						var tmpWid = $(window).width();
						if(tmpWid > 1600) {
							tmpWid = 1600;
						} else {
							var column = Math.floor(tmpWid / 400);
							tmpWid = column * 400;
						}
						$('.waterfull').width(tmpWid);
					}
					tores();
					$(window).resize(function() {
						tores();
					});
					container.imagesLoaded(function() {
						container.masonry({
//							columnWidth: 400,
							itemSelector: '.item',
							isFitWidth: true, //是否根据浏览器窗口大小自动适应默认false
							isAnimated: true, //是否采用jquery动画进行重拍版
							isRTL: false, //设置布局的排列方式，即：定位砖块时，是从左向右排列还是从右向左排列。默认值为false，即从左向右
							isResizable: true, //是否自动布局默认true
							animationOptions: {
								duration: 800,
								easing: 'easeInOutBack', //如果你引用了jQeasing这里就可以添加对应的动态动画效果，如果没引用删除这行，默认是匀速变化
								queue: false //是否队列，从一点填充瀑布流
							}
						});
					});
				})
					
					
				


			}
		]);
})(window, angular);