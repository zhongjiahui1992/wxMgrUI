(function (window, angular) {
    'use strict';

    angular.module("app").controller(
        'autoReplyController',
        [
            '$localStorage',
            'globalParam',
            '$scope',
            '$location',
            '$log',
            '$q',
            '$rootScope',
            '$window',
            'routeService',
            '$http',
            function autoReplyController($localStorage, globalParam,$scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http) {

                //本个js文件的注释别删
                //本个js文件的注释别删
                //本个js文件的注释别删
                //本个js文件的注释别删
                //本个js文件的注释别删
                //本个js文件的注释别删

        //初始化tab
        layui.use('element', function(){
            var element = layui.element;
        });

//type=0

        $scope.currentPageNum=1;
        //获取自动回复列表
        $scope.getAutoReplyData=function () {
            $scope.typeTwoData=[];
            $scope.picMess=[];
            $http({
                url: $localStorage.serviceUrl+'get_auto_reply',
                method: 'get'
            }).success(function (resp) {
                $scope.autoReplyData=resp.data;
                $scope.autoReplyData0=[];
                $scope.alltotals=0;
                for(var i=0;i<$scope.autoReplyData.length;i++){
                    if($scope.autoReplyData[i].type==1){
                        $scope.unmatchReplayData.content=$scope.autoReplyData[i].content;
                        $('.delUnmatchReply').removeAttr('disabled');
                    }else if($scope.autoReplyData[i].type==2){
                        if($scope.autoReplyData[i].replytype=='text'){
                            $scope.txtMessData.content=$scope.autoReplyData[i].content;
                            $('.delCaredtxtReply').removeAttr('disabled');
                        }else{
                            $scope.picMessDataGet=$scope.autoReplyData[i].newsArticleList
                            $('#delNewsBtn').removeClass('layui-btn-disabled');
                            $('#news_before').hide();
                        }
                    }else{
                        $scope.autoReplyData0.push(resp.data[i]);
                        $scope.alltotals++;
                    }
                }

                $scope.autoReplyData1=$scope.autoReplyData0.slice(($scope.currentPageNum-1)*10,$scope.currentPageNum*10);
                console.log($scope.autoReplyData1);
                //分页功能
                setTimeout(function(){
                    layui.laypage.render({
                        elem: 'demo2'
                        ,count: $scope.alltotals
                        ,theme: '#1E9FFF'
                        ,jump: function(obj, first){
                            $("#demo2 a").click(function () {
                                var index=$(this).index();
                                if(index==0){
                                    $scope.currentPageNum=1;
                                }else if(index==Math.ceil($scope.alltotals/10)+1){
                                    $scope.currentPageNum=Math.ceil($scope.alltotals/10);
                                }else{
                                    $scope.currentPageNum=index;
                                }
                                $scope.autoReplyData1=$scope.autoReplyData0.slice(($scope.currentPageNum-1)*10,$scope.currentPageNum*10);
                                $scope.$apply();
                                /*$scope.autoReplyData1=$scope.autoReplyData0.slice(($scope.currentPageNum-1)*10,$scope.currentPageNum*10);
                                 console.log($scope.autoReplyData1);*/
                            })
                        }
                    });

/*                    $("#demo2 a").click(function () {
                        var index=$(this).index();
                        console.log(index)
                        /!*$scope.autoReplyData1=$scope.autoReplyData0.slice(($scope.currentPageNum-1)*10,$scope.currentPageNum*10);
                        console.log($scope.autoReplyData1);*!/
                    })*/

                },0);

            }).error(function (error) {
                console.log("获取失败")
            });
        }
        $scope.getAutoReplyData();

        //分页-假


        //添加回复
        $scope.addReply = function () {
            routeService.route(12041, false);
        };
		//修改回复
	    $scope.revise = function (reply) {
	    	// globalParam.setter(id);
            globalParam.setter(reply);
	    	routeService.route(12042, false);
	    };


//type=1

	    //保存未匹配回复
        $scope.unmatchReplayData={
            content:'',
            type:'1'
        }
        $scope.saveUnmatchReplyData=function () {
            if($scope.unmatchReplayData.content){
                $http({
                    url: $localStorage.serviceUrl+'add_auto_reply',
                    method: 'get',
                    params:$scope.unmatchReplayData
                }).success(function (resp) {
                    layer.alert('保存成功');
                    $scope.getAutoReplyData();
                }).error(function (error) {
                    layer.alert('保存失败');
                });
            }else {
                layer.alert('请输入回复');
            }

        }
        //删除未匹配回复
        $scope.delUnmatchReplyData=function () {
            $http({
                url: $localStorage.serviceUrl+'del_auto_reply',
                method: 'get',
                params:{type:'1'}
            }).success(function (resp) {
                layer.alert('删除成功');
                $scope.unmatchReplayData={
                    content:'',
                    type:'1'
                }
                $scope.getAutoReplyData();
                $('.delUnmatchReply').attr('disabled','disabled');
            }).error(function (error) {
                layer.alert('删除失败');
            });
        }

		//删除
        $scope.deletes = function(id) {
            var layerIndex = layer.confirm('确定删除本条数据吗？', {
                btn : [ '确定', '取消' ]
            // 按钮
            }, function() {
                $http({
                    url : $localStorage.serviceUrl + "delete_rule",
                    method: "get",
                    params:{id:id}
                }).success(function success(result) {
                    $scope.getAutoReplyData();
                    layer.alert("删除成功")
                }, function failure(result) {
                	layer.alert("删除失败！")
                });
                layer.close(layerIndex);
            }, function() {

            });
        };
	    $scope.addUser = function () {
	    	//参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
	    	//参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
	    	routeService.route(804, false);
	    };


//type=2

        // //增加要保存的图文消息
        // $scope.saveObj={
        //     title:'',
        //     desc:'',
        //     id:'',
        //     picurl:'',
        //     url:''
        // };
        // $scope.addPicData=function () {
        //     $scope.saveObj.id=$scope.picMessData.length+1;
        //
        //     $scope.picMessData.push($scope.saveObj);
        //     $scope.saveObj={
        //         title:'',
        //         desc:'',
        //         id:'',
        //         picurl:'',
        //         url:''
        //     };
        // }
        // //保存图文消息
        // $scope.picMessData=[];
        // $scope.savePicMess = function () {
        //     $http({
        //         method: "post",
        //         url:  $localStorage.serviceUrl + "add_news_reply",
        //         params:$scope.picMessData
        //     }).success(
        //         function () {
        //             layer.alert('保存成功');
        //             $scope.getAutoReplyData();
        //         }
        //     );
        // }
        // //删除图文消息
        // $scope.delPicMess = function () {
        //     $scope.picMessData=[];
        //     $http({
        //         method: "post",
        //         url:  $localStorage.serviceUrl + "add_news_reply",
        //         params:$scope.picMessData
        //     }).success(
        //         function () {
        //             layer.alert('删除成功');
        //             $scope.getAutoReplyData();
        //         }
        //     );
        // }
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
                        $scope.getAutoReplyData();
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
                    $scope.txtMessData={
                        content:'',
                        type:'2'
                    }
                    $scope.getAutoReplyData();
                    $('.delCaredtxtReply').attr('disabled','disabled');
                }
            );
        }


                //model1-增加图文
                $scope.picMessData=[];
                $scope.addPicMess=function () {
                    $("#resetNewreply").click();
                    $("#img_before").show();
                    $("#img_after").hide();
                    $("#img_after").children().remove();
                    layer.open({
                        type: 1,
                        content: $("#newReplyDiv"),
                        title: "添加图文",
                        area: ['800px', '600px'],
                        btn: ['确定'],
                        btnAlign: 'c',
                        yes:function(index){
                            var artData = $("#formNewsReply").serializeObject();
                            if(artData.desc&&artData.picurl&&artData.title&&artData.url){
                                var xid = $scope.picMessData.length + 1;
                                var newsHtml = '<div id="'+xid+'" class="item">';
                                newsHtml += '<a href="'+artData.url+'" target="_blank">';
                                newsHtml += '<p>'+artData.title+'</p>';
                                newsHtml += '<img src="'+artData.picurl+'" /></a>';
                                newsHtml += '<div class="item-btn">';
                                newsHtml += '<button type="button" class="item-btn-s update_news"><i class="fa fa-edit"></i></button>';
                                newsHtml += '<button type="button" class="item-btn-s delete_news"><i class="fa fa-trash-o"></i></button>';
                                newsHtml += '</div></div>';
                                $("#news_after").append(newsHtml);
                                $("#news_after").show();
                                $scope.picMessData.push(artData);
                                layer.close(index);
                                $("#newReplyDiv").css("display","none");
                            }else{
                                layer.alert("请完善信息")
                            }
                        },
                        // no:function (index) {
                        //     layer.close(index);
                        //     console.log(5641)
                        //     $("#newReplyDiv").css("display","none");
                        // },
                        cancel:function (index) {
                            layer.close(index);
                            $("#newReplyDiv").css("display","none");
                        }
                    })
                }


                $(".add_mass_material").click(function (){
                     $("#chooseimg").click();
                     console.log(111)
                     layui.upload.render({
                         url: $localStorage.serviceUrl + 'upload_news_reply'
                         ,unwrap: true
                         ,elem: '#chooseimg' //指定原始元素，默认直接查找class="layui-upload-file"
                         ,method: 'post' //上传接口的http类型
           /*              ,before: function(){
                             layer.msg("文件上传中，请稍候...", {
                                 offset: 't'
                             });
                         }*/
                         ,done: function(resp){
                             console.log(123)
                             console.log(resp)
                             if(resp.resMsg == "Success"){
                                 layer.msg("上传成功", {offset: 't'});
                                 $("#img_before").hide();
                                 $("#img_after").show();
                                 var massAfter = '<div class="item-img">';
                                 massAfter += '<input hidden type="text" name="picurl" value="'+resp.data+'" />';
                                 massAfter += '<img src="'+resp.data+'" />';
                                 massAfter += '<a class="delete_mass_material" name="mass_img" href="javascript:;">删除</a></div>'
                                 $("#img_after").append(massAfter);
                             }else{
                                 layer.msg(JSON.stringify(resp.result), {
                                     offset: 't'
                                 });
                             }
                         }
                     });
                    //layer.alert("暂未开通")
                })

                $(document).on('click','.delete_mass_material',function(){
                    $("#img_before").show();
                    $("#img_after").hide();
                    $("#img_after").children().remove();
                })


                //model-1从素材库中选择
                $scope.selectImg=function () {
                    $scope.initMaterialsDiv("image", false);
                }

                $scope.initMaterialsDiv=function(materialtype, inMaterialPage){

                    $http({
                        url: $localStorage.serviceUrl + 'get_materials_files',
                        method: 'get',
                        params:{materialtype:'image'}
                    }).success(function (resp) {
                        $scope.initLayerOpenDiv(resp, materialtype);
                    }).error(function (error) {
                        console.log("失败")
                    });
                }

                //model-2选择素材框
                $scope.initLayerOpenDiv=function(resp, materialtype){
                    $("#material_layer_open").children().remove();
                    $scope.initImagesLayerOpen(resp);
                    layer.open({
                        type: 1,
                        content: '<div id="material_layer_open">'+$scope.selectImgContent+'</div>',
                        btn:['确定','取消'],
                        title: "选择素材",
                        area: ['1000px', '500px'],
                        yes:function(index){
                            layer.close(index);
                            var currTab = $("#mass_tab").find(".layui-this").text();
                            $("#img_before").hide();
                            $("#img_after").show();
                            $("#material_layer_open .item-box").css('display','none');
                            var newsAfterDel = '<a class="delete_mass_material" name="mass_img" href="javascript:;">删除</a>';
                            var newsAfter = $("#material_layer_open .isClicked");
                            newsAfter.append(newsAfterDel);
                            newsAfter.append('<h3 id="'+newsAfter[0].id+'" style="display:none;"></h3>');
                            newsAfter.append('<input hidden type="text" name="picurl" value="'+newsAfter.find("img")[0].src+'">');
                            newsAfter.removeClass("click_for_choose");
                            $("#img_after").append(newsAfter);
                        }
                    });
                }

                //model-2选择素材框:content拼接
                $scope.initImagesLayerOpen=function(resp){

                    $scope.selectImgContent=''
                    for(var i=0;i<resp.data.length;i++){
                        var layerchild = '<div id="'+resp.data[i].mediaid+'" class="item-img click_for_choose"><div class="item-box"><i class="fa fa-check"></i></div>';
                        layerchild += '<img src="'+resp.data[i].url+'" />';
                        layerchild += '<span>'+resp.data[i].name+'</span></div>';
                        $scope.selectImgContent+=layerchild;
                    }
                }

                $(document).on('click','.click_for_choose',function(){
                    $("#material_layer_open .click_for_choose").removeClass("isClicked");
                    $("#material_layer_open .item-box").css('display','none');
                    $(this).find(".item-box").css('display','block');
                    $(this).addClass("isClicked");
                    /*var materialType = '';
                     var currTab = $("#mass_tab").find(".layui-this").text();
                     if(currTab.indexOf("图文消息")!= -1){
                     materialType = "news";
                     }*/
                })

                $(document).on('click','.delete_news',function(){
                    this.parentNode.parentNode.remove();
                    var id = this.parentNode.parentNode.id;
                    $scope.picMessData.splice(id-1,1);
                    if($scope.picMessData.length == 0){
                        $("#news_before").show();
                        $("#news_after").children().remove();
                        $("#news_after").hide();
                        $("#delNewsBtn").addClass("layui-btn-disabled");
                    }
                })


                //保存图文消息
                $scope.picMessData=[];
                $scope.savePicMess = function () {
                    if($scope.picMessData.length){
                        $.ajax({
                            type: "POST",
                            url: $localStorage.serviceUrl + "add_news_reply",
                            data: JSON.stringify($scope.picMessData),
                            contentType: "application/json; charset=utf-8",
                            datatype:"json",
                            success: function(resp){
                                if(resp.resCode == 1){
                                    layer.alert("提交成功");
                                    $("#news_before").hide();
                                    $("#delNewsBtn").removeClass("layui-btn-disabled");
                                    $(".item-btn").hide();
                                }else{
                                    layer.alert("提交失败");
                                }
                            }
                        })
                    }else{
                        layer.alert("无数据提交")
                    }
                }
                //删除图文消息
                $scope.delPicMess = function () {
                    $scope.picMessData=[];
                    $http({
                        method: "get",
                        url:  $localStorage.serviceUrl + "del_auto_reply",
                        params:{type: 2}
                    }).success(

                        function () {
                            layer.alert('删除成功');
                            $("#news_before").show();
                            $("#news_after").children().remove();
                            $("#news_after").hide();
                            $("#delNewsBtn").addClass("layui-btn-disabled");
                            $scope.getAutoReplyData();
                        }
                    );
                }
                // $("#submitNewsBtn").click(function(){
                //     $.ajax({
                //         type: "POST",
                //         url: $localStorage.serviceUrl + "/add_news_reply",
                //         data: JSON.stringify($scope.picMessData),
                //         contentType: "application/json; charset=utf-8",
                //         datatype:"json",
                //         success: function(resp){
                //             console.log(resp);
                //             if(resp.result == "success"){
                //                 layer.msg("提交成功", {offset: 't'});
                //                 $("#news_before").hide();
                //                 $("#delNewsBtn").attr("disabled", "false");
                //                 $("#delNewsBtn").removeClass("layui-btn-disabled");
                //             }else{
                //                 layer.msg(resp.message, {offset: 't'});
                //             }
                //         }
                //     })
                // })

                // $("#delNewsBtn").click(function () {
                //     $.ajax({
                //         type: "GET",
                //         url: $localStorage.serviceUrl + "/del_auto_reply",
                //         data : {type: 2},
                //         success: function(resp){
                //             console.log(resp);
                //             if(resp.result == "success"){
                //                 layer.msg("删除成功", {offset: 't'});
                //                 $("#news_before").show();
                //                 $("#news_after").children().remove();
                //                 $("#news_after").hide();
                //                 $("#delNewsBtn").attr("disabled", "true");
                //                 $("#delNewsBtn").addClass("layui-btn-disabled");
                //             }else{
                //                 layer.msg(resp.message, {offset: 't'});
                //             }
                //         }
                //     })
                // })
                $.fn.serializeObject = function() {
                    var o = {};
                    var a = this.serializeArray();
                    $.each(a, function() {
                        if (o[this.name] !== undefined) {
                            if (!o[this.name].push) {
                                o[this.name] = [o[this.name]];
                            }
                            o[this.name].push(this.value || '');
                        } else {
                            o[this.name] = this.value || '';
                        }
                    });
                    return o;
                };


    }]);
})(window, angular);
  