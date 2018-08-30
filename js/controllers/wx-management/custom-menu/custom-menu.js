(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'customMenuController',
        [
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
            function customMenuController($localStorage, $scope, $location, $log,$q, $rootScope,globalParam, $window, routeService, $http) {
			
	        //API
			$scope.selectedMenuIndex= '';//当前选中菜单索引
			//公众号标题
			$scope.initMenu = {
		        weixinTitle: '公众号菜单',
		        menu: {'buttons': []},//当前菜单
		        selectedSubMenuIndex:'',//当前选中子菜单索引
				menuNameBounds:false,//菜单长度是否过长
				material:{
		            title:'',
		            url:'',
		            thumb_url:''
		        }
			};
			//初始化菜单
			$scope.getMenu = function(){
				$http({
					method: "GET",
					url: $localStorage.serviceUrl + 'get_menu'
				}).success(
					function(res) {
                        $scope.menu = res.data.menu
					}
				);
			};
			//选中主菜单
			$scope.selectedMenu = function(i){
				$scope.selectedSubMenuIndex='';
				$scope.selectedMenuIndex=i;
				var selectedMenu=$scope.menu.buttons[$scope.selectedMenuIndex];
            	//检查名称长度
            	$scope.checkMenuName(selectedMenu.name)
			};
			//选中子菜单
			var selectedSubMenu;
	        $scope.selectedSubMenu = function(i){
	            $scope.selectedSubMenuIndex=i;
          		selectedSubMenu=$scope.menu.buttons[$scope.selectedMenuIndex].subButtons[$scope.selectedSubMenuIndex];
	            $scope.checkMenuName($scope.selectedSubMenu.name)
	        };
	        //选中菜单级别
			$scope.selectedMenuLevel = function () {
	            if ($scope.selectedMenuIndex !== '' && $scope.selectedSubMenuIndex === '') {
	                //主菜单
	                return 1;
	            }else if ($scope.selectedMenuIndex !== '' && $scope.selectedSubMenuIndex !== '') {
	                //子菜单
	                return 2;
	            }else {
	                //未选中任何菜单
	                return 0;
	            }
	        };
	        //添加菜单
			$scope.addMenu = function(level){
				if(level==1&&$scope.menu.buttons.length<3){
					$scope.menu.buttons.push({
						"type": "view",
						"name": "菜单名称",
						"subButtons": [],
	                    "url":""
					})
	                $scope.selectedMenuIndex=$scope.menu.buttons.length-1
	                $scope.selectedSubMenuIndex=''
				}
				if(level==2&&$scope.menu.buttons[$scope.selectedMenuIndex].subButtons.length<5){
					$scope.menu.buttons[$scope.selectedMenuIndex].subButtons.push({
						"type": "view",
						"name": "子菜单名称",
	                    "url":""
					})
					$scope.selectedSubMenuIndex=$scope.menu.buttons[$scope.selectedMenuIndex].subButtons.length-1
				}
			};
			//删除菜单
			$scope.delMenu = function(){
				if($scope.selectedMenuLevel()==1&&confirm('删除后菜单下设置的内容将被删除')){
					
					if($scope.selectedMenuIndex===0){
							$scope.menu.buttons.splice($scope.selectedMenuIndex, 1);
							$scope.selectedMenuIndex = 0;
					}else{
							$scope.menu.buttons.splice($scope.selectedMenuIndex, 1);
							$scope.selectedMenuIndex -=1;
					}
					if($scope.menu.buttons.length===0){
	                    $scope.selectedMenuIndex = '';
	                }
										
				}else if($scope.selectedMenuLevel()==2){
	                if($scope.selectedSubMenuIndex===0){
	                    $scope.menu.buttons[$scope.selectedMenuIndex].subButtons.splice($scope.selectedSubMenuIndex, 1);
	                    $scope.selectedSubMenuIndex = 0;
	                }else{
	                    $scope.menu.buttons[$scope.selectedMenuIndex].subButtons.splice($scope.selectedSubMenuIndex, 1);
	                    $scope.selectedSubMenuIndex -= 1;
	                }
	                if($scope.menu.buttons[$scope.selectedMenuIndex].subButtons.length==0){
	                    $scope.selectedSubMenuIndex = '';
	                }
				}
			};
			 //检查菜单名称长度
//			 $scope.countNum = 255;
//			    $scope.checkText = function () {
//			    	$scope.countNum = 255 - $scope.text.length;
//			        if ($scope.text.length > 255) {
//			            weui.alert("你好，描述字数控制在255字以内！");
//			            $scope.text = $scope.text.substr(0, 255);
//			            $scope.countNum = 0;
//			        }
//			    };
			$scope.checkMenuName = function(val){
				if($scope.selectedMenuLevel()==1&&$scope.getMenuNameLen(val)<=8){
					console.log("=======主菜单========")
	                $scope.menuNameBounds=false
				}else if($scope.selectedMenuLevel()==2&&$scope.getMenuNameLen(val)<=16){
	                $scope.menuNameBounds=false
					console.log("=======子菜单========")
	                
				}else{
				    $scope.menuNameBounds=true
	            }
			};
	        //获取菜单名称长度
	        $scope.getMenuNameLen = function (val) {
	            var len = 0;
	            for (var i = 0; i < val.length; i++) {
	                var a = val.charAt(i);
	                a.match(/[^\x00-\xff]/ig) != null?len += 2:len += 1;
	            }
	            console.log(len)
	            return len;
	        };
	        //获取菜单列表
	        $scope.dataList = function() {
				$http({
					method: "GET",
					url: $localStorage.serviceUrl + 'list_url',
				}).success(
					function(res) {
                    $scope.modalList=res.data;
                    }
				);
			};
			
			//打开 公众号图文模态框
			$scope.selectNewsUrl = function() {
				$("#newsUrl").modal('show');
				$scope.dataList();
			};
			
			//获取Radio中 Value值
			$scope.linkList = function(_url,_type){
				$scope._url = _url;
				$scope._type =_type ;
			};
			
			//设置图文链接
			$scope.setNewsUrl = function(){
				$http({
					method: "GET",
					url: $localStorage.serviceUrl + 'menu_url',
					params:{
						basedomain:JSON.parse($localStorage.sUserData).basedomain,
						url:$scope._url,
						type:$scope._type
					}
				}).success(
					function(res) {
                    $scope.menu.buttons[$scope.selectedMenuIndex].subButtons[$scope.selectedSubMenuIndex].url =res.data; 
                    $("#newsUrl").modal('hide');
                    }
				);
				
			};
			
			//保存并发布
			$scope.creatMenu = function(){
				$scope._load = layer.load(3, {shade: [0.3, '#000000']});
				$scope.pageUrl = $scope.menu.buttons[$scope.selectedMenuIndex].subButtons[$scope.selectedSubMenuIndex].url;
				//页面地址
            	if($scope.pageUrl == null) {
					layer.close($scope._load);//关闭加载Loading
					layer.msg("页面地址不能为空！");
		            return;
				}
				
				//校验菜单名长度
//				if($scope.selectedMenuLevel()==1&&$scope.getMenuNameLen(val)<=8){
//					layer.close($scope._load);//关闭加载Loading
//					layer.msg("字数不超过4个汉字或8个字母！");
//		            return;
//				}else if($scope.selectedMenuLevel()==2&&$scope.getMenuNameLen(val)<=16){
//	                layer.close($scope._load);//关闭加载Loading
//					layer.msg("字数不超过4个汉字或8个字母！");
//		            return;
//				}else{
//	            }
				
				
				$http({
					method: "post",
//					url:' http://wx.hezhangzhi.cn/wx/wxManager/create_menu',
					url:$localStorage.serviceUrl + '/create_menu',
					data:$scope.menu.buttons,
		            contentType: "application/json; charset=utf-8",
		            datatype:"json",
				}).success(
					function(res) {
						layer.msg('保存成功');
						layer.close($scope._load);//关闭加载Loading
						//重新获取菜单
						$scope.getMenu();
					}
				);
				
			}
			
			//关闭 公众号图文模态框
			$scope.modalClose = function() {
				$("#newsUrl").modal('hide');
			};
			
			
			
			
     }]);
})(window, angular);

