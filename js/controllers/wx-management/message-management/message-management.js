(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'messageManagementController',
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
            function messageManagementController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope,globalParam, $window, routeService, $http) {


// 表单分页
        //获取消息列表
        var reGetProducts = function() {
            $http({
                url:  $localStorage.serviceUrl+'message/list',
                method: 'GET',
                params: {pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage}
            }).success(
                function(resp) {
                    $scope.paginationConf.totalItems = resp.data.total;
                    $scope.messListData = resp.data.list;
                }).error(function(error) {
                console.log("获取失败")
            });
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
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);


		//删除
        $scope.deletes = function(id) {
            var layerIndex = layer.confirm('确定删除本条数据吗？', {
                btn : [ '确定', '取消' ]
            // 按钮
            }, function() {
                $http({
                    url : $localStorage.serviceUrl + "/message/delete",
                    method: "get",
                    params:{massid:id}
                }).success(function success(result) {
                    reGetProducts();
                    layer.alert("删除成功")
                }, function failure(result) {
                	layer.alert("删除失败！")
                });
                layer.close(layerIndex);
            }, function() {

            });
        };



     }]);
})(window, angular);

