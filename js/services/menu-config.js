angular.module('menu.config', [])
	.service('menuConfig', ['$document', '$q','$http','$localStorage', function ($document, $q, $http, $localStorage) {


	    this.targetHTML = function (menuId) {
            console.log('menuId'+menuId);
            var htmlAndJsList = $localStorage.htmlAndJs;
            for(var i=0;i<htmlAndJsList.length;i++){
            	var mathState = htmlAndJsList[i].type+"_"+htmlAndJsList[i].seqId;
                if(menuId === mathState){
                    console.log('targetHtml'+htmlAndJsList[i].targetHtml);
                    console.log(this.getServiceURL() + "/" + htmlAndJsList[i].targetHtml)
                    return this.getServiceURL() + "/" + htmlAndJsList[i].targetHtml;
                }
            }
            return this.getServiceURL() + "/src/tpl/404.html";

        };

        this.targetJS = function (menuId) {
	        console.log('menuId'+menuId);
	        var htmlAndJsList = $localStorage.htmlAndJs;
	        var resTargetJS = [];
            for(var i=0;i<htmlAndJsList.length;i++){
            	var mathState = htmlAndJsList[i].type+"_"+htmlAndJsList[i].seqId;
                if(menuId === mathState){
                    console.log('targetJs'+htmlAndJsList[i].targetJs);
                    
                    if(htmlAndJsList[i].targetJs && htmlAndJsList[i].targetJs.length >0){
                    	for(var j=0;j<htmlAndJsList[i].targetJs.length; j++){
                    		//targetJsArr.push(htmlAndJsList[i].targetJs[j]);
                    		var jsPath =  this.getServiceURL() + "/" + htmlAndJsList[i].targetJs[j];
                    		resTargetJS.push(jsPath);
                    	}
                    }
                }
            }
            if(resTargetJS && resTargetJS.length > 0){
            	return resTargetJS;
            }else{
            	return [this.getServiceURL() + "/src/js/controllers/404.js"];
            }
        }
        this.getServiceURL = function(){
        	return $localStorage.ipAdd;
        }
}]);