'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
.filter('trustHtml', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);