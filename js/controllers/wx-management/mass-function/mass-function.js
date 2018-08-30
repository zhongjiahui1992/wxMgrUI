(function(window, angular) {
	'use strict';

	angular.module("app").controller(
		'massFunctionController', [
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
			function massFunctionController($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http) {
				
				//初始化图文编辑器
				$scope.localgetImg = $localStorage.serviceUrl_localgetImg;
				$scope.onlinegetImg = $localStorage.serviceUrl_onlinegetImg;
				
				//v:1 标签显示 | v:0 '全部'显示
				$scope.selectedChange = function (v) {
					if(v == 1){
						console.log(v)
						$scope.childData = true;
					}else{
						console.log(v)
						$scope.childData = false;
					}
				}
				$scope.selectedChildChange = function (v) {
					$("#setChild").find("option:selected").text();
					console.log($("#setChild").find("option:selected").text())
				}
				
				//获取标签数据
				$scope.tipsData = function(){
					$http({
                        url: $localStorage.serviceUrl+'get_tags',
                        method: 'get'
                    }).success(function (resp) {
                    	console.log(resp)
                        $scope.tagsData=resp.data;
                    	console.log($scope.tagsData)
//                  	$scope.firstSelectId = $scope.tagsData[0].id;
                    	console.log($scope.firstSelectId)
                    }).error(function (error) {
                        console.log("获取失败")
                    });
				}
				//标签分组切换
				$scope.tips_Change = function(id){
					$scope.tips_Change_id = id;
					console.log($scope.tips_Change_id);
				}
				
				//选择素材
				$scope.graphicDetail = function(index,id){
					$scope.coverBox = index;
					$scope.mediaid = id;
					console.log($scope.mediaid)
					$http({
						method: 'post',
						url: $localStorage.serviceUrl + 'get_one_news',
						params:{  
	                     	newsMediaId:id
	                    }
					}).success(function success(result) {
						if(result.resCode==1){
							console.log(result);
							$scope.massGrphic = true;
							$scope.massMediaId = result.data.mediaid
							console.log($scope.massMediaId)
							$scope.graphicData = result.data;
							$scope.graphic = result.data.newsArticleList;
							$scope.updatetime = result.data.updatetime;
							console.log($scope.graphicData)
						}else{
							layer.msg(result.resMsg,{time:2000});
						}
					}, function failure(result) {
					});
				}
				
				//删除素材
				$scope.massGrphicDel = function(){
					$scope.massGrphic = false;
				}
				
				//选择图片
				var massmediaid,coverUrl;
				$scope.choseBtn = function(mediaid,url,index,name){
					console.log(url)
					massmediaid = mediaid;
					$scope.massmediaid = mediaid;
					console.log($scope.massmediaid)
					$scope.massImgName = name;
					console.log($scope.massImgName);
					$scope.dfsUrl = url;
					console.log($scope.dfsUrl)
					$scope.massImgbox = true;
					$scope.coverBox = index;
				}
				
				//选择音频
				$scope.voiceLinkList = function(id,name){
					$scope.massmediaid = id;
					console.log($scope.massmediaid);
					$scope.massVoiceName = name;
					console.log($scope.massVoiceName);
					$scope.voicetmpImportBox = true;
				}
				
				//选中视频
				$scope.videoLinkList = function(id,name){
					$scope.massmediaid = id;
					console.log($scope.massmediaid);
					$scope.massVideoName = name;
					console.log($scope.massVideoName);
					$scope.videotmpImportBox = true;
				}
				//图文消息
				$scope.selectMaterial = function (){
					$('#selectMaterial').modal('show');
					$http({
						url: $localStorage.serviceUrl + 'get_materials_news',
						method: 'GET',
						params: {
							materialtype:'graphic'
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
				}
				
				//图、音、视消息
				$scope.selectMaterialType = function(massImport,url,materialtype){
					console.log(massImport)
					$('#'+ massImport).modal('show');
					$http({
						url: $localStorage.serviceUrl + url,
						method: 'GET',
						params: {
							materialtype:materialtype
						},
					}).success(
						function(resp) {
							console.log(resp)
							if(resp.data.resCode == 1004){
								$scope.materialTypeData = [];
								layer.msg("暂无数据！");
							}else{
								$scope.materialTypeData = resp.data.list;
							}
						}).error(function(error) {});	
				}
				
				//关闭模态框
				$scope.massOk = function(){
					$('#selectMaterial').modal('hide');
				}
				$scope.uploadOk = function(id){
					console.log(id)
					$('#'+id).modal('hide');
				}
				
				//新建图文
				$scope.graphicNew = function() {
					routeService.route(12045, false);
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
							columnWidth: 800,
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
				
				
				//上传图片
				$scope.uploadImg = function() {
					$scope._load = layer.load(3, {shade: [0.3, '#000000']});
					$scope.reader = new FileReader();
					var formFile = new FormData();
					var fileObj = document.querySelector('input[type=file]').files[0];
					var objUrl = getObjectURL(fileObj);
					if(objUrl) {
						$("#masspic").attr("src", objUrl); //将图片路径存入src中，显示出图片
					}
					
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
							url: $localStorage.serviceUrl + 'upload_mass_material',
							data: data,
							headers: {'Content-Type': undefined},
							transformRequest: angular.identity
							}
						).success(function(res) {
							$scope.massImgbox = true;
							console.log(res)
							$scope.massImgName = res.data.filename;
							$scope.massMediaId = res.data.massmediaid
							layer.close($scope._load);//关闭加载Loading
							layer.msg("图片上传成功！");
							//上传成功的操作
							$("#imgTmpImportBox").modal('hide');
						});
						
						
					function getObjectURL(file) {
						var url = null;
						if(window.createObjectURL != undefined) { // basic
							url = window.createObjectURL(file);
						} else if(window.URL != undefined) { // mozilla(firefox)
							url = window.URL.createObjectURL(file);
						} else if(window.webkitURL != undefined) { // webkit or chrome
							url = window.webkitURL.createObjectURL(file);
						}
						return url;
					}
						
				}
				//删除图片
				$scope.massmaterialDel = function(){
					$scope.massImgbox = false;
					$("#masspic").attr("src", '');	
				}
				
				//打开音频、视频模态框
				$scope.add_mass_material = function(massType,massModal){
					$('#'+massModal).modal('show');
					
				}
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
							url: $localStorage.serviceUrl + 'upload_mass_material',
							data: data,
							headers: {'Content-Type': undefined},
							transformRequest: angular.identity
							}
						).success(function(res) {
							console.log(res);
							$scope.voicetmpImportBox = true;
							$scope.massVoiceName = res.data.filename;
							$scope.massMediaId = res.data.massmediaid;
							layer.close($scope._load);//关闭加载Loading
							layer.msg("音频上传成功！");
							//上传成功的操作
							$("#voiceTmpImportBox").modal('hide');
						});
				}
	            //删除音频
	            $scope.massVoiceDel = function(){
	            	 $scope.voicetmpImportBox = false;
	            	 $scope.voiceTitle = '';
	            }
	            
	            //上传视频
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
							url: $localStorage.serviceUrl + 'upload_mass_material',
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
							$scope.videotmpImportBox = true;
							$scope.massVideoName = res.data.filename;
							$scope.massMediaId = res.data.massmediaid;
							layer.close($scope._load);//关闭加载Loading
							//上传成功的操作
							$("#videoTmpImportBox").modal('hide');
						}).error(function(){ });
				}
	            
	            //删除视频
				 $scope.massVideoDel = function(){
	            	 $scope.videotmpImportBox = false;
	            	 $scope.videoTitle = '';
	            	 $scope.videoDsc = '';
	            }
				
				//群发提交按钮
				$scope.submitMaterial = function(){
					var massUrl = "";
					var selectAll = $("select[name=all]").val();
					var selectTag = $("select[name=tag]").val();
	    			var selectSex = $("select[name=sex]").val();
	    			
	    			var massTabText = $("#mass_tab").find("li.active").text();
			        console.log(massTabText);
			        
			        var massType = "";
			        var massMediaId = "";
			        var massContent = "";
			        
			        if(massTabText.indexOf("文字")!=-1){
			            massType = "text";
			            massContent = $("#mass_text").val();
			        }else if(massTabText.indexOf("图片")!=-1){
			            massType = "image";
			        }else if(massTabText.indexOf("语音")!=-1){
			            massType = "voice";
			        }else if(massTabText.indexOf("视频")!=-1){
			            massType = "mpvideo";
			        }else if(massTabText.indexOf("图文消息")!=-1){
			            massType = "mpnews";
			        }
	    			
					if (selectAll == 0){
						if(selectSex == 0){
							selectSex = 0;
							console.log(selectSex)
						}else if(selectSex == 1){
							selectSex = 1;
							console.log(selectSex)
						}else{
							selectSex = 2;
						}
						massUrl = "/send_mass_openid";
	            		$scope.sendMassMessageByOpenId(massUrl,selectSex,massType,massMediaId,massContent);
					}else{
						selectTag = $scope.tips_Change_id;
						massUrl = "/send_mass_group";
	            		$scope.sendMassMessageByTag(massUrl,selectTag,massType,massMediaId,massContent);
					}
				}
				
				//全部用户
				$scope.sendMassMessageByOpenId = function(massUrl,selectSex,massType,massMediaId,massContent){
					layer.msg("我是sendMassMessageByOpenId测试提示框！")
					$http({
						method: 'post',
						url: $localStorage.serviceUrl + massUrl,
						params: {
							massSex:selectSex,
							massType:massType,
							massMediaId:$scope.massMediaId,
							massContent:massContent
						},
					}).success(function(res) {
						console.log(res)
					}).error(function() {
					});
				}
				
				//按标签选择
				$scope.sendMassMessageByTag = function(massUrl,selectTag,massType,massMediaId,massContent){
					layer.msg("我是sendMassMessageByTag测试提示框！")
					$http({
						method: 'post',
						url: $localStorage.serviceUrl + massUrl,
						params: {
							massTag:selectTag,
							massType:massType,
							massMediaId:$scope.massMediaId,
							massContent:massContent
						},
					}).success(function(res) {
						console.log(res)
					}).error(function() {
					});
				}
				
				
				
				
				
			}
		]);
})(window, angular);