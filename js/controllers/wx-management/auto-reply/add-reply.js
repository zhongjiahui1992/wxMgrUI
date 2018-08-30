(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'addReplyController',
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
            function addReplyController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http) {


        	$scope.type='半匹配'
        	$scope.addReplyData={
        		roleName:'',
				type:'',
				keyword:'',
                content:''
			}

			//添加回复
			$scope.addReply = function () {
				if (!$scope.addReplyData.roleName || !$scope.type || !$scope.addReplyData.keyword || !$scope.addReplyData.content){
					layer.alert("请完善信息");
				}else{
					// var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
					if($scope.type=='半匹配'){
                        $scope.addReplyData.type='0';
					}else{
                        $scope.addReplyData.type='1'
					}

					$http({
			            method: "post",
			            url:  $localStorage.serviceUrl + "add_rule",
			            params:$scope.addReplyData
			    		}).success(
							function () {
								layer.alert('创建成功');
								routeService.route(1204,true);
					    }
					);
				}
		    }

		    //返回
			$scope.back = function () {
				//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
		    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
				routeService.route(1204,true);
		    }
        }]);
})(window, angular);


