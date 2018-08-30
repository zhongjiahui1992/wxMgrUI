(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'userInfo',
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
            function userInfo($localStorage, $scope, $location, $log,
                                                 $q, $rootScope,globalParam, $window, routeService, $http) {


// 	 	//分页
//         var reGetProducts = function () {
//             $http({
//                 url: '',
//                 method: 'get',
// //	        	params:{pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
//             }).success(function (resp) {
//                 // 变更分页的总数
//                 $scope.paginationConf.totalItems = resp.data.totalNum;
// //		        // 变更产品条目
//                 $scope.riverList = resp.data.records;
//             }).error(function (error) {

//             });
//         };

//         // 配置分页基本参数
//         $scope.paginationConf = {
//             currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
//             itemsPerPage: 10,
//             pagesLength: 5,
//             perPageOptions: [1, 2, 3, 4, 5, 10],
//             onChange: function () {
//                 console.log($scope.paginationConf.currentPage);
//                 $location.search('currentPage', $scope.paginationConf.currentPage);
//             }
//         };
//         // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
//         $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

                // //删除
                // $scope.deletes = function(id) {
                //     var layerIndex = layer.confirm('确定删除本条数据吗？', {
                //         btn : [ '确定', '取消' ]
                //         // 按钮
                //     }, function() {
                //         $http({
                //             url : $localStorage.serviceUrl + "",
                //             method: "delete",
                //             params:{id:id}
                //         }).success(function success(result) {
                //             reGetProducts();
                //             alert("删除成功")
                //         }, function failure(result) {
                //             alert("删除失败！")
                //         });
                //         layer.close(layerIndex);
                //     }, function() {
                //
                //     });
                // };

                console.log(112)
                $scope.userData={
                    wxname:'',
                    wxinitid:'',
                    wxappid:'',
                    wxappsecret:'',
                    wxtoken:'',
                    wxaeskey:'',
                    basedomain:''
                }
                //获取用户数据
                $scope.getUserData=function () {
                    console.log({type:$localStorage.userInfoType})
                    $http({
                        url : $localStorage.serviceUrl + "get_bind_info",
                        method: "get",
                        params:{type:$localStorage.userInfoType}
                    }).success(function success(resp) {
                        console.log(resp)
                        if(resp.data){
                            $scope.userData=resp.data;
                            $scope.userData.wxinitid=$scope.userData.wxoriginalid;
                            $localStorage.sUserData=JSON.stringify($scope.userData);
                        }else{
                            $scope.userData={
                                wxname:'',
                                wxinitid:'',
                                wxappid:'',
                                wxappsecret:'',
                                wxtoken:'',
                                wxaeskey:'',
                                basedomain:''
                            }
                        }
                    }).error(function () {

                    })
                }
                $scope.getUserData();
                //绑定用户
                $scope.bindUser=function () {
                    console.log($scope.userData)
                    if($scope.userData.wxname&&$scope.userData.wxinitid&&$scope.userData.wxappid&&$scope.userData.wxappsecret&&$scope.userData.wxtoken&&$scope.userData.basedomain){
                        $http({
                            url : $localStorage.serviceUrl + "bind_wechat",
                            method: "post",
                            params:$scope.userData
                        }).success(function success(resp) {
                            console.log(resp)
                            $localStorage.sUserData=JSON.stringify($scope.userData);
                        }).error(function () {

                        })
                    }
                }

                // $scope.updateUserData=function () {
                //     var layerIndex = layer.confirm('是否确定修改用户信息？', {
                //         btn : [ '是', '否' ]
                //         // 按钮
                //     }, function() {
                //         $http({
                //             url : $localStorage.serviceUrl + "",
                //             method: "delete",
                //             params:{id:id}
                //         }).success(function success(resp) {
                //             reGetProducts();
                //             alert("修改成功")
                //         }, function failure(result) {
                //             alert("修改失败！")
                //         });
                //         layer.close(layerIndex);
                //     }, function() {
                //
                //     });
                // }
                // $scope.updateUserPassword=function () {
                //     $scope.password={
                //         old:'',
                //         new:'',
                //         sure:''
                //     }
                //     var layer = layui.layer;
                //     layer.open({
                //         type: 1,
                //         title:'修改密码',
                //         content: '<div id="modifyPwdForm" style="padding-top: 15px;" class="layui-layer-wrap">' +
                //         '<form class="layui-form" style="margin-right: 0;"> <div class="layui-form-item"> ' +
                //         '<label class="layui-form-label" style="width: 90px;">原始密码</label> <div class="layui-input-inline"> ' +
                //         '<input type="password" lay-verify="required" name="oldPwd" placeholder="必填" autocomplete="off" class="layui-input"> ' +
                //         '</div> </div> <div class="layui-form-item"> <label class="layui-form-label" style="width: 90px;">修改密码</label> ' +
                //         '<div class="layui-input-inline"> <input type="password" lay-verify="required" name="newPwd" placeholder="必填" autocomplete="off" class="layui-input"> ' +
                //         '</div> </div> <div class="layui-form-item"> <label class="layui-form-label" style="width: 90px;">确认密码</label> ' +
                //         '<div class="layui-input-inline"> <input type="password" lay-verify="required" name="confirmPwd" placeholder="必填" autocomplete="off" class="layui-input"> ' +
                //         '</div> </div> </form> </div>',
                //         btn: ['确定', '取消'],
                //         shadeClose: true,
                //         yes: function (index,layero) {
                //             $scope.password.old=$('#modifyPwdForm').find('input').eq(0).val();
                //             $scope.password.new=$('#modifyPwdForm').find('input').eq(1).val();
                //             $scope.password.sure=$('#modifyPwdForm').find('input').eq(2).val();
                //             // console.log($('modifyPwdForm').find('input').eq(0))
                //
                //             layer.close(index);
                //             console.log($scope.password);
                //
                //             $http({
                //                 url: $localStorage.serviceUrl+'modify_tag_for_one',
                //                 method: 'post',
                //                 params:obj
                //             }).success(function (resp) {
                //                 console.log(resp)
                //
                //             }).error(function (error) {
                //                 console.log(222)
                //             });
                //             layer.close(index);
                //         }
                //     });
                // }

            }]);
})(window, angular);

