// 'use strict';
//
// /* Controllers */
//   // signin controller
// app.controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
//     console.log(111)
//     $scope.user = {};
//     $scope.authError = null;
//     $scope.login = function() {
//       $scope.authError = null;
//       // Try to login
//       $http.post('api/login', {email: $scope.user.email, password: $scope.user.password})
//       .then(function(response) {
//         if ( !response.data.user ) {
//           $scope.authError = 'Email or Password not right';
//         }else{
//           $state.go('app.dashboard-v1');
//         }
//       }, function(x) {
//         $scope.authError = 'Server Error';
//       });
//     };
//   }])
// ;



'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state','$localStorage', 'globalParam','$rootScope',function($scope, $http, $state,$localStorage, globalParam,$rootScope) {

    var x;
    $scope.user = {};
    $scope.authError = '';
    $scope.user.username = null;
    $scope.user.password = null;
    $scope.user.code = null;

    $scope.uuid = function(){
        var len=32;//32长度
        var radix=16;//16进制
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}}
        return uuid.join('');
    }

    $.ajax({
        type : "Get",
        url : "config/ip.json",
        async : false
    }).done(function(data){
        if($localStorage.ipAdd == undefined){
            $localStorage.ipAdd = data['ip'];
            console.log("the oms address valid.");
        }
    });

    $scope.login = function() {
        //$state.go('app.dashboard-v1');
        $scope.authError = null;
        $localStorage.userLoginInfo = {};
        console.log(uuid)
        $http({
            method: 'post',
            url: $localStorage.signinUrl+"login/login",
            params: {loginName:$scope.user.username,password:$scope.user.password,imageCode:$scope.user.code,imageCodeId:uuid},
        }).then(function successCallback(resp) {
            if(resp.data.resCode == 0)
            {
                $scope.authError = resp.data.resMsg;
                $scope.user.password = null;
                $scope.user.code = null;
                $localStorage.userLoginInfo = null;
                $scope.freshCode();
            }else{
                globalParam.setter({"accessToken":resp.data.data.tokenInfo.token});
                $localStorage.userLoginInfo.token = resp.data.data.tokenInfo.token;
                $localStorage.userLoginInfo.userInfo = resp.data.data.userDTO;
                $state.go('app.dashboard-v1');
            }
        }, function errorCallback(response) {
            // 请求失败执行代码
        });

    }

    var uuid = $scope.uuid();
    // var requestUrl = $localStorage.ipAdd.replace("http:","") + "/randImage/imageCode?imageCodeId="+uuid;
    // var requestUrl='//10.0.6.238:8888/randImage/imageCode?imageCodeId=30A2FCD3CFED7FAF735653B0B26F88A0'
    var requestUrl =$localStorage.signinUrl+'randImage/imageCode?imageCodeId='+uuid;
    console.log(requestUrl)
    // console.log('//127.0.0.1:8080/randImage/imageCode?imageCodeId=25440B8F2615B9ACF89B4128303829DC')
    $scope.validecode = {'background': 'url('+requestUrl+') no-repeat'};
    $scope.freshCode = function()
    {
        $scope.validecode = {'background': 'url('+requestUrl+'&date=' + new Date().getSeconds() + ') no-repeat'};
    }
    

    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [];
    $scope.addSlide = function () {
//        var newWidth = 600 + slides.length + 1;
        slides.push({
            image: 'img/login/1.jpg',
            text: '1'
        });
        slides.push({
            image: 'img/login/2.jpg',
            text: '2'
        });
        slides.push({
            image: 'img/login/3.jpg',
            text: '3'
        });
        slides.push({
            image: 'img/login/4.jpg',
            text: '4'
        })
    };
    $scope.addSlide();

    // $scope.codeList = [
    //     {
    //         'id': '1',
    //         'name': '人人护水',
    //         'scan': '下载人人护水APP',
    //         'src': 'img/login/1.jpg'
    //     },{
    //         'id': '2',
    //         'name': '安卓简化版',
    //         'scan': '下载安卓简化版APP',
    //         'src': 'img/login/2.jpg'
    //     }
    // ]

}])
;