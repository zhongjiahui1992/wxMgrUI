(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'addAttentionReplyController',
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
            function addAttentionReplyController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http) {

                //保存图文消息
				$scope.picMessData=[{}];
                $scope.savePicMess = function () {
					$http({
						method: "post",
						url:  $localStorage.serviceUrl + "add_news_reply",
						params:$scope.picMessData
					}).success(
						function () {
							layer.alert('创建成功');
							routeService.route(1204,true);
						}
					);
                }
                //删除图文消息
                $scope.delPicMess = function () {
					$http({
						method: "post",
						url:  $localStorage.serviceUrl + "",
						params:$scope.addReplyData
					}).success(
						function () {
							layer.alert('创建成功');
							routeService.route(1204,true);
						}
					);
                }
                //保存文字消息
				$scope.txtMessData={
                	content:'',
					type:'2'
				}
                $scope.saveTxtMes = function () {
                    if (!$scope.txtMessData.content){
                        layer.alert("请完善信息");
                    }else{
                        $http({
                            method: "get",
                            url:  $localStorage.serviceUrl + "add_auto_reply",
                            params:$scope.txtMessData
                        }).success(
                            function () {
                                layer.alert('保存成功');
                                routeService.route(1204,true);
                            }
                        );
                    }
                }
                //删除文本消息
                $scope.delTxtMess = function () {
					$http({
						method: "get",
						url:  $localStorage.serviceUrl + "del_auto_reply",
						params:{type:'2'}
					}).success(
						function () {
							layer.alert('删除成功');
							routeService.route(1204,true);
						}
					);
                }

                //返回
                $scope.back = function () {
                    //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
                    //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
                    routeService.route(1204,true);
                }
            }]);
})(window, angular);


