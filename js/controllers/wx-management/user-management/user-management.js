(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'userManagementController',
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
            function userManagementController($localStorage, $scope, $location, $log,
                                                 $q, $rootScope,globalParam, $window, routeService, $http) {


// 表单分页



                //获取全部用户列表
                var reGetProducts = function() {

                    $http({
                        url:  $localStorage.serviceUrl+'get_users',
                        method: 'GET',
                        params: {pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage}
                    }).success(
                        function(resp) {
                            $scope.paginationConf.totalItems = resp.data.total;
                            $scope.usersData = resp.data.list;
                            $scope.showTag={
                                appid:"",
                                count:"",
                                groupid:"",
                                id:"",
                                name:"全部用户"
                            };
                        }).error(function(error) {
                        console.log("获取失败");
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


                //add
                $scope.usersData=[];

                $scope.tagsData=[];

                $scope.blackListData=[]

                $scope.showTag={
                    appid:"",
                    count:"",
                    groupid:"",
                    id:"",
                    name:"全部用户"
                };

                

                  $scope.getAllUsers=function () {
                      $scope.tagidsArr=[];
                      reGetProducts();
                  }
                   $scope.getAllUsers();

                //显示用户列表时切割tagids
                $scope.tagidsArr=[];
                $scope.splitTagids=function(tagids,index){
                    if(tagids==''){
                        $scope.tagidsArr[index]=['无标签'];
                    }else{
                        $scope.tagidsArr[index]=tagids.split(',');
                    }
                }

                //显示黑名单列表时切割tagids
                $scope.blackTagidsArr=[];
                $scope.splitBlackTagids=function(tagids,index){
                    if(tagids==''){
                        $scope.blackTagidsArr[index]=['无标签'];
                    }else{
                        $scope.blackTagidsArr[index]=tagids.split(',');
                    }
                }

                //获取单个标签用户列表
                $scope.getUsersDataByTag=function (index) {
                    $scope.tagFlag=index;

                    $http({
                        url: $localStorage.serviceUrl+'get_tag_user_list',
                        method: 'get',
                        params:{tagid:$scope.tagsData[index].groupid,pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage}
                    }).success(function (resp) {
                        $scope.paginationConf.totalItems = resp.data.total;
                        $scope.usersData=resp.data.list;

                        $scope.showTag.appid=$scope.tagsData[index].appid
                        $scope.showTag.count=$scope.tagsData[index].count
                        $scope.showTag.groupid=$scope.tagsData[index].groupid
                        $scope.showTag.id=$scope.tagsData[index].id
                        $scope.showTag.name=$scope.tagsData[index].name
                    }).error(function (error) {
                        console.log("获取失败")
                    });
                }

                //获取标签列表
                $scope.getTagsData=function () {
                    $http({
                        url: $localStorage.serviceUrl+'get_tags',
                        method: 'get'
                    }).success(function (resp) {
                        $scope.tagsData=resp.data;
                    }).error(function (error) {
                        console.log("获取失败")
                    });
                }
                $scope.getTagsData();

                //重命名标签
                $scope.tagRename=function () {
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.prompt({title: '重命名',value:$scope.showTag.name},function(val, index){
                            $http({
                                url: $localStorage.serviceUrl+'update_tag',
                                method: 'get',
                                params:{groupid:$scope.showTag.groupid,name:val,count:$scope.showTag.count}
                            }).success(function (resp) {
                                $scope.getUsersDataByTag($scope.tagFlag);
                                $scope.getTagsData();
                                $scope.getBlackListData();
                            }).error(function (error) {
                                console.log("重命名失败");
                            });
                            layer.close(index);

                        });
                    });
                }

                //删除标签
                $scope.tagDel=function () {
                    var layerIndex = layer.confirm('确定删除？', {
                        btn : [ '确定', '取消' ]
                        // 按钮
                    }, function() {
                        $http({
                            url: $localStorage.serviceUrl+'delete_tag',
                            method: 'post',
                            params:{tagid:$scope.showTag.groupid}
                        }).success(function (resp) {
                            $scope.getAllUsers();
                            $scope.getTagsData();
                            $scope.getBlackListData();
                        }).error(function (error) {
                            console.log("删除失败")
                        });
                        layer.close(layerIndex);
                    }, function() {

                    });
                }

                //新建标签
                $scope.createTag=function(){
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.prompt({title: '新建标签'},function(val, index){
                            $http({
                                url: $localStorage.serviceUrl+'create_tag?name='+val,
                                method: 'get'
                            }).success(function (resp) {
                                layer.alert("新建成功");
                                $scope.getTagsData();
                            }).error(function (error) {
                                layer.alert("新建成失败");
                            });
                            layer.close(index);

                        });
                    });
                }


                // //根据用户名搜索--ok
                // $scope.searchData='';
                // $scope.searchUser=function(){
                //     var userList = [];
                //     var name = $("input[name=nickname]").val();
                //     if(name == ""){
                //         layui.use('layer', function(){
                //             var layer = layui.layer;
                //             layer.msg("请输入搜索关键字", {
                //                 offset: 't'
                //             });
                //         })
                //     }
                //     for(var i=0;i<$scope.usersData.length;i++){
                //         var user = $scope.usersData[i];
                //         if(user.nickname.indexOf(name)!=-1){
                //             userList.push(user);
                //         }
                //     }
                //     $scope.usersData=[];
                //     $scope.usersData=userList;
                //     // layui.use('laypage',function(){
                //     //     var laypage = layui.laypage;
                //     //     laypage({
                //     //         cont: "pageusers",
                //     //         pages: Math.ceil(userList.length/20),
                //     //         curr: 1,
                //     //         jump: function(obj, first){
                //     //             $("#userList").find("li").remove();
                //     //             initUserList(userList, 0, obj.curr);
                //     //         }
                //     //     });
                //     // })
                // }


                //修改备注
                $scope.updateRemark=function (index,openid,remark) {
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.prompt({title: '修改备注',value:remark},function(val, index){
                            $http({
                                url: $localStorage.serviceUrl+'update_user_remark?openid='+openid+"&remark="+val,
                                method: 'get'
                            }).success(function (resp) {
                                layer.alert("修改成功");
                                $scope.getAllUsers();
                            }).error(function (error) {
                                layer.alert("修改失败");
                            });
                            layer.close(index);
                        });
                    });
                }

                //增加标签-单个-普通
                $scope.addUserTag=function (userIndex) {
                    var addtaghtml = '';
                    var pretagids = [];
                    for(var i=0;i<$scope.tagsData.length;i++){
                        if($scope.tagsData[i].name!='黑名单'&&$scope.tagsData[i].name!='未分组'){
                            var isChecked = false;
                            for(var j=0;j<$scope.tagidsArr[userIndex].length;j++){
                                if($scope.tagsData[i].name==$scope.tagidsArr[userIndex][j]){
                                    isChecked = true;
                                    pretagids.push($scope.tagsData[i].groupid.toString());
                                }
                            }
                            if(isChecked){
                                addtaghtml += '<div class="checkTagInBox"><input type="checkbox" name="tagdiv" value="'+$scope.tagsData[i].groupid+'" checked>'+$scope.tagsData[i].name+'</div>';
                            }else{
                                addtaghtml += '<div class="checkTagInBox"><input type="checkbox" name="tagdiv" value="'+$scope.tagsData[i].groupid+'">'+$scope.tagsData[i].name+'</div>';
                            }
                        }
                    }
                    if(pretagids.length==0){
                        pretagids.push('isNull');
                    }
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.open({
                            type: 1,
                            content: '<div id="#addTagDiv">'+addtaghtml+'</div>',
                            btn: ['确定', '取消'],
                            shadeClose: true,
                            yes: function (index,layero) {
                                layer.close(index);
                                var aftertagids = [];
                                $('input:checkbox[name=tagdiv]:checked').each(function(i){
                                    aftertagids.push($(this).val());
                                })
                                if(aftertagids.length == 0){
                                    aftertagids.push("isNull");
                                }

                                var obj={openids: $scope.usersData[userIndex].openid,pretagids: pretagids,aftertagids: aftertagids}
                                $http({
                                    url: $localStorage.serviceUrl+'modify_tag_for_one',
                                    method: 'post',
                                    params:obj
                                }).success(function (resp) {

                                    $scope.getAllUsers();
                                    $scope.getTagsData();
                                    $scope.getBlackListData();
                                }).error(function (error) {
                                    console.log("增加标签失败")
                                });
                                layer.close(index);
                            }
                        });
                    })
                }

                //增加标签-单个-黑名单
                $scope.addBlackUserTag=function (userIndex) {
                    var addtaghtml = '';
                    var pretagids = [];
                    for(var i=0;i<$scope.tagsData.length;i++){
                        if($scope.tagsData[i].name!='黑名单'&&$scope.tagsData[i].name!='未分组'){
                            var isChecked = false;
                            for(var j=0;j<$scope.blackTagidsArr[userIndex].length;j++){
                                if($scope.tagsData[i].name==$scope.blackTagidsArr[userIndex][j]){
                                    isChecked = true;
                                    pretagids.push($scope.tagsData[i].groupid.toString());
                                }
                            }
                            if(isChecked){
                                addtaghtml += '<div class="checkTagInBox"><input type="checkbox" name="tagdiv" value="'+$scope.tagsData[i].groupid+'" checked>'+$scope.tagsData[i].name+'</div>';
                            }else{
                                addtaghtml += '<div class="checkTagInBox"><input type="checkbox" name="tagdiv" value="'+$scope.tagsData[i].groupid+'">'+$scope.tagsData[i].name+'</div>';
                            }
                        }
                    }
                    if(pretagids.length==0){
                        pretagids.push('isNull');
                    }
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.open({
                            type: 1,
                            content: '<div id="#addTagDiv">'+addtaghtml+'</div>',
                            btn: ['确定', '取消'],
                            shadeClose: true,
                            yes: function (index,layero) {
                                layer.close(index);
                                var aftertagids = [];
                                $('input:checkbox[name=tagdiv]:checked').each(function(i){
                                    aftertagids.push($(this).val());
                                })
                                if(aftertagids.length == 0){
                                    aftertagids.push("isNull");
                                }

                                var obj={openids: $scope.usersData[userIndex].openid,pretagids: pretagids,aftertagids: aftertagids}
                                $http({
                                    url: $localStorage.serviceUrl+'modify_tag_for_one',
                                    method: 'post',
                                    params:obj
                                }).success(function (resp) {
                                    $scope.getAllUsers();
                                    $scope.getTagsData();
                                    $scope.getBlackListData();
                                }).error(function (error) {
                                    console.log("增加标签失败")
                                });
                                layer.close(index);
                            }
                        });
                    })
                }

                //增加标签-批量
                $scope.addBatchTag=function () {
                    if($('#addbatchtag').hasClass("layui-btn-primary")){
                        $scope.initTagsForAddTagButton();

                        var openids = [];
                        $("#userList input[name='subBox']:checkbox:checked").each(function(){
                            openids.push(this.title);
                        })

                        layui.use('layer', function(){
                            var layer = layui.layer;
                            layer.open({
                                type: 1,
                                content: '<div id="#addTagDiv">'+$scope.addtaghtml+'</div>',
                                btn: ['确定', '取消'],
                                shadeClose: true,
                                yes: function (index,layero) {
                                    layer.close(index);
                                    var tagids = [];
                                    $('input:checkbox[name=tagdiv]:checked').each(function(i){
                                        tagids.push($(this).val());
                                    })
                                    if(tagids.length > 0){
                                        $http({
                                            url: $localStorage.serviceUrl+'batch_tag_users',
                                            method: 'post',
                                            params:{openids: openids,tagids: tagids},
                                        }).success(function (resp) {

                                            $scope.getAllUsers();
                                            $scope.getTagsData();
                                            $scope.getBlackListData();
                                            reClass();
                                        }).error(function (error) {
                                            console.log("增加标签失败")
                                        });
                                    }

                                }
                            });
                        })
                    }
                }
                $scope.initTagsForAddTagButton=function () {
                    $scope.addtaghtml = '';
                    for(var i=0;i<$scope.tagsData.length;i++) {
                        if ($scope.tagsData[i].name != '黑名单'&&$scope.tagsData[i].name!='未分组') {
                            $scope.addtaghtml += '<div class="checkTagInBox"><input type="checkbox" name="tagdiv" value="' + $scope.tagsData[i].groupid + '">' + $scope.tagsData[i].name + '</div>';
                        }
                    }
                }

                //全选--用户列表
                $scope.toggleTagAndBlackButton=function () {
                    if($('#userList input[name="subBox"]').filter(":checked").length > 0){
                        $("#addbatchtag").removeClass("layui-btn layui-btn-disabled").addClass("layui-btn layui-btn-primary");
                        $("#addbatchblack").removeClass("layui-btn layui-btn-disabled").addClass("layui-btn layui-btn-primary");
                    }else{
                        reClass();
                    }
                }

                function reClass() {
                    $("#addbatchtag").removeClass("layui-btn layui-btn-primary").addClass("layui-btn layui-btn-disabled");
                    $("#addbatchblack").removeClass("layui-btn layui-btn-primary").addClass("layui-btn layui-btn-disabled");
                }

                //全选--黑名单列表
                $scope.toggleTagAndBlackButton2=function () {
                    if($('#blackList input[name="subBox"]').filter(":checked").length > 0){
                        $("#removeFromBlack").removeClass("layui-btn layui-btn-disabled").addClass("layui-btn layui-btn-primary");
                    }else{
                        reClass2();
                    }
                }

                function reClass2() {
                    $("#removeFromBlack").removeClass("layui-btn layui-btn-primary").addClass("layui-btn layui-btn-disabled");
                }

                //加入黑名单
                $scope.addBatchBlack=function () {
                    var openids = [];
                    $("#userList input[name='subBox']:checkbox:checked").each(function(){
                        openids.push(this.title);
                    })
                    if(openids.length > 0){
                        $scope.PushOrPopBlackListByOpenIds("/push_to_black",openids);
                    }
                }

                //移除黑名单
                $scope.removeFromBlack=function () {
                    var openids = [];
                    $("#blackList input[name='subBox']:checkbox:checked").each(function(){
                        openids.push(this.title);
                    })
                    if(openids.length > 0){
                        $scope.PushOrPopBlackListByOpenIds("/pull_from_black",openids);
                    }
                }

                //获取黑名单
                $scope.getBlackListData=function () {
                    $scope.blackTagidsArr=[];
                    $http({
                        url: $localStorage.serviceUrl+'get_black_list',
                        method: 'get'
                    }).success(function (resp) {
                        $scope.blackListData=resp.data;
                    }).error(function (error) {
                        console.log("获取失败")
                    });
                }
                $scope.getBlackListData();

                //黑名单相关请求
                $scope.PushOrPopBlackListByOpenIds=function (url,openids) {
                    $http({
                        url: $localStorage.serviceUrl + url,
                        method: 'post',
                        params: {openids: openids},
                        headers: {'Content-Type': undefined}
                    }).success(function (resp) {

                        $scope.getAllUsers();
                        $scope.getTagsData();
                        $scope.getBlackListData();
                        reClass();
                    }).error(function (error) {
                        console.log("失败")
                    });
                }

            }]);
})(window, angular);