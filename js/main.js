'use strict';

/* Controllers */ 

angular.module('app')
    .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window','moduleService', 'routeService','$http',
        function(              $scope,   $translate,   $localStorage,   $window , moduleService,routeService,$http) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

            var x;
            $localStorage.signinUrl = 'http://172.30.0.110:8888/';
            $localStorage.serviceUrl = 'http://wx.hezhangzhi.cn/wx/wxManager/';
	        //$localStorage.serviceUrl = 'http://10.0.6.82:8081/';
	        $localStorage.serviceUrl_localgetImg = 'http://file.91hzw.cn:8080/';
	        $localStorage.serviceUrl_onlinegetImg = 'http://file.91hzw.cn:8080/';
	         
	        $localStorage.wxunionServiceUrl = 'http://wx.hezhangzhi.cn/wx/wxManager/';
	         

            $http.get("config/ip.json").success(function(data){
                $localStorage.ipAdd = data['ip'];
                // $localStorage.serviceUrl = data['ip'];
                // console.log('ipAdd = '+ $localStorage.ipAdd);
                try{
                    if($localStorage.userLoginInfo.token){
                        console.log('existing');
                    }
                }catch(e) {
                    location.href=$localStorage.ipAdd+"/#/access/signin";
                }
            }).error(function(){
                alert("config/ip.json/配置初始化出错了！")
            });

            //请求二维码
            $scope.getCodeMess=function () {
                $http({
                    url : $localStorage.serviceUrl + "getQrcode",
                    method: "get"
                }).success(function success(resp) {
                    $scope.codeMess=resp.data;
                }).error(function () {

                })
            }
            $scope.getCodeMess();
            //进入用户信息页面请求的type
            $localStorage.userInfoType='1';
            //个人信息页面跳转---add by hnc
            $scope.toUserInfo=function () {
              console.log(1213)
                $localStorage.userInfoType='1';
                routeService.route(12010,false);
            }

            // logo显示隐藏
            $scope.noblock = false;
            // config
            $scope.app = {
                name: '微信管理',
                version: '2.1.1',
                logoImg:'img/logo.png',


                // for chart colors
                color: {
                    primary: '#7266ba',
                    info:    '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger:  '#f05050',
                    light:   '#e8eff0',
                    dark:    '#3a3f51',
                    black:   '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                }
            }

            // save settings to local storage
            if ( angular.isDefined($localStorage.settings) ) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            if(angular.isDefined($localStorage.appConfig)){
                $scope.appConfig = $localStorage.appConfig;
            }
            else{
                //加载配置信息
                moduleService.getConfig();
                $scope.appConfig = $localStorage.appConfig;
            }

            //获取二级菜单,默认就三级菜单
            $scope.getSecondMenuTest=function (seqId) {
                $http({
                    url : $localStorage.serviceUrl + "config",
                    method: "get"
                }).success(function success(resp) {
                    console.log(resp)
                    if(resp.resCode==0){
                        $localStorage.userInfoType='0';
                        routeService.route(12010, false);
                        // $scope.getSecondMenu(seqId);
                    }
                    if(resp.resCode==1){
                        console.log(resp)
                        console.log(9998);
                        $localStorage.sUserData=JSON.stringify(resp.data);
                        console.log($localStorage.sUserData);
                        $scope.getSecondMenu(seqId);
                    }
                }).error(function () {

                })
            }
            $scope.getSecondMenu = function (seqId){
                var menus = $localStorage.appMenus;
                var secondMenu = [];
                for(var i=0; i<menus.length; i++){
                    if(menus[i].parentId == seqId)
                    {
                        menus[i].children = [];
                        if(menus[i].url=="")//还有子菜单
                        {
                            for(var j=0; j<menus.length; j++)
                            {
                                if(menus[i].seqId == menus[j].parentId)
                                {
                                    menus[i].children.push(menus[j]);
                                }
                            }
                        }
                        secondMenu.push(menus[i]);
                    }
                }
                $scope.menuObj = secondMenu;
            }
            $scope.$watch('app.settings', function(){
                if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);


            // angular translate
            $scope.lang = { isopen: false };
            $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
            $scope.setLang = function(langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            function isSmartDevice( $window )
            {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

        }]);