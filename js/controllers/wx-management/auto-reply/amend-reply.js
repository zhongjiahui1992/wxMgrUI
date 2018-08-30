(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'amendReplyController',
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
            function amendReplyController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {


        $scope.loadData=function () {
            $scope.updateOldData=globalParam.getter();
            $scope.updateNewData={
                roleName:'',
                type:'',
                keyword:'',
                content:'',
                id:''
            };
            $scope.type=''
            $scope.updateNewData.roleName=$scope.updateOldData.name
            $scope.updateNewData.keyword=$scope.updateOldData.keyword
            $scope.updateNewData.content=$scope.updateOldData.content
            $scope.updateNewData.id=$scope.updateOldData.id

            if($scope.updateOldData.type){
                $scope.type='全匹配';
            }else{
                $scope.type='半匹配';
            }
        }


        //修改回复
        $scope.updateReply = function () {
            if (!$scope.updateNewData.roleName || !$scope.type || !$scope.updateNewData.keyword || !$scope.updateNewData.content){
                layer.alert("请完善信息");
            }else{
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                if($scope.type=='半匹配'){
                    $scope.updateNewData.type='0';
                }else{
                    $scope.updateNewData.type='1'
                }
                $http({
                    method: "post",
                    url:  $localStorage.serviceUrl + "add_rule",
                    params:$scope.updateNewData
                }).success(
                    function () {
                        layer.alert('修改成功');
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

