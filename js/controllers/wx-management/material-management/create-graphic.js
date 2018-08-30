(function(window, angular) {
	'use strict';
	angular.module("app").controller(
		'createGraphicController', [
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
			function createGraphicController($localStorage, $scope, $location, $log, $q, $rootScope,globalParam, $window, routeService, $http, $sce) {
				
				//获取编辑图文
//				$scope.editorDataList = globalParam.getter();
//				console.log($scope.editorDataList);
				//初始化图文编辑器
				$scope.init = function(){
//					$scope.graphic = $scope.editorDataList.data.newsArticleList;
				}
				
				$scope.localgetImg = $localStorage.serviceUrl_localgetImg;
				$scope.onlinegetImg = $localStorage.serviceUrl_onlinegetImg;
				
				//选中图片库
				$scope.selectMaterial = function (){
					$('#imgImportBox').modal('show');
					$http({
						url: $localStorage.serviceUrl + 'get_materials_files',
						method: 'GET',
						params: {
							materialtype:'image'
						},
					}).success(
						function(resp) {
							console.log(resp)
							if(resp.data.resCode == 1004){
								$scope.imgData = [];
								layer.msg("暂无数据！");
							}else{
								$scope.imgData = resp.data.list;
							}
						}).error(function(error) {});
				}
				
				//选中封面图
				var massmediaid,coverUrl;
				$scope.choseBtn = function(mediaid,url,index){
					massmediaid = mediaid;
					coverUrl = $scope.localgetImg + url;
					$scope.coverBox = index;
					$("#pic").attr("src", coverUrl); 
				}
				
				//模态框确定按钮
				$scope.uploadOk = function(){
					$('#imgImportBox').modal('hide');
				}
				
				//新增文章
				$scope.graphic = [];
				$scope.addItem = function() {
					$scope.artNumber = $(".itemUlBox li").length + 1;
					console.log($scope.artNumber)
					if($scope.artNumber > 8) {
						layer.msg("最多新增8篇文章！");
						return false;
					}
					
					var wxTitle = $("#wxTitle").val();
					if(!wxTitle) {
						layer.close($scope._load);
						layer.msg('标题不能为空');
						return;
					}

					var wxAuthor = $("#wxAuthor").val();
					if(!wxAuthor) {
						layer.close($scope._load);
						layer.msg('作者名称不能为空');
						return;
					}

					var digest = $("#digest").val();
					if(!digest) {
						layer.close($scope._load);
						layer.msg('摘要内容不能为空');
						return;
					}
					
					$scope.newItem = {
						title: $scope.wxTitle,
						author:$scope.wxAuthor,
						thumburl:coverUrl,
						thumb_media_id:massmediaid,
						digest:$scope.digest,
						content: ue.getContent()
					};
					$scope.graphic.push($scope.newItem);
					console.log($scope.graphic)
					
					$scope.wxTitle ='';
					$scope.wxAuthor ='';
					$scope.digest ='';
					$('#pic').attr('src','/src/img/upload.png');
					ue.setContent('');
				}
				
				//编辑图文
				$scope.editorOne = function (index){
					console.log(index)
				}
				
				//删除图文
				$scope.materialDel = function(key, arr, $event) {
					console.log(key);
					console.log(arr);
					arr.splice(key, 1);	
					$event.stopPropagation();
					
				}
				
				//图文提交
				$scope.submit = function() {
					$scope._load = layer.load(3, {
						shade: [0.3, '#000000']
					});
					var ue = UE.getEditor('editor');
					ue.ready(function() {});
					console.log(ue.getContent())
					if($scope.graphic == ''){
						layer.close($scope._load);
						layer.msg('至少上传一篇图文');
						return;
					}
					
					$http({
						method: 'post',
						url: $localStorage.serviceUrl + 'upload_news',
						cache: false,
						data: JSON.stringify($scope.graphic),
						processData: false,
						contentType: false,
						dataType: "json",
						headers: {
							'Content-Type': undefined
						},
						transformRequest: angular.identity
					}).success(function(res) {
						console.log(res)
						layer.close($scope._load); //关闭加载Loading
						layer.msg('素材上传成功');
					}).error(function() {
						layer.close($scope._load);
						layer.msg('素材上传失败');
					});

				}

				// 返回按钮
				$scope.back = function() {
					routeService.route(1201, true);
				}
			}
		]);
})(window, angular);