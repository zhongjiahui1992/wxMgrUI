(function (window, angular) {
    'use strict';
    angular.module("app").controller(
        'wxIndexController',
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
            function wxIndexController($localStorage, $scope, $location, $log,
                                                     $q, $rootScope, $window, routeService, $http){


            $scope.init=function(){
                $scope.size = 7;
                $scope.time = '0';
                $scope.load();
            }
            $scope.load=function(){
                $http({
                    url:$localStorage.serviceUrl + "/userNumber",
                    method: 'GET',
                }).then(function (res) {
                    $scope.userNumber = res.data.data;
                });
                $http({
                    url:$localStorage.serviceUrl + "/statistics",
                    method: 'GET',
                    params:{dayNumber:$scope.size,timestamp:$scope.time},
                }).then(function (res) {
                    $scope.number = res.data.data;
                    console.log($scope.number)
                    var myChart = echarts.init(document.getElementById('main'));
                    var option = {
                        backgroundColor:
                         new echarts.graphic.LinearGradient(0, 0, 0, 1,
                            [{
                              offset: 0, color: '#f27d87'
                            },
                            {
                              offset: 1, color: '#9978f0'
                            }
                            ]),
                        xAxis: {
                            type: 'category',
                            data: $scope.number.timestamps
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: $scope.number.peopleNumber,
                            type: 'line',
                            smooth: true,
                            areaStyle: {normal:{}},
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#fff'},
                                            {offset: 0.5, color: '#fff'},
                                            {offset: 1, color: '#fff'}
                                        ]
                                    )
                                }
                            },
                        }]
                    };
                    myChart.setOption(option);
                });
            }
            $scope.getDay = function(day){
                $scope.size = day;
                $scope.load();
            }

            //选择时间
                var datepicker1 = $('#datetimepicker1').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change',
                    function (e) {
                    var result = new moment(e.date).format('YYYY-MM-DD');
                    $scope.dateOne = result;
                    $scope.$apply();
                });


            $scope.find = function(){
                console.log($rootScope.token);
                $scope.time = $("#time").val();
                $scope.load();
            }

            }]);
})(window, angular);


