angular.module('app').factory('globalParam', [ function(){
    var testObject = {};
    
    var _setter = function (data) {
    	testObject = data;
    };
    
    var _getter = function () {
    	return testObject;
    };
    
    return {
    	setter: _setter,
      getter: _getter
    }               
}]);
