angular.module('app')
    .service('moduleService', ['$localStorage','$document', '$q', '$timeout', '$http', '$state', function ($localStorage,$document, $q, $timeout, $http, $state) {

    	this.getConfig = function(){
    			
	        $.ajax({
	            type : "Get",
	            url : "config/config.json", 
	            async : false
	        }).done(function(data){
	        	//loadTreeData(data);
	        	$localStorage.appMenus = data.menus;
	        	$localStorage.appConfig = loadTree(data);
	        	$localStorage.htmlAndJs = getHtmlAndJsPath(data);
	        	console.log("appconifg:"+data);
	        }).error(function(errordata){
	        	
	        });
	           
    	}
    	function getHtmlAndJsPath(data){
    		var menus = data.menus;
    		var pages = data.pages;
    		var resData = [];
    		//设置菜单跳转属性
    		if(menus && menus.length>0){
    			pushTargeItem(resData, menus, 1);
    		}
    		//设置页面跳转属性
    		if(pages && pages.length>0){
    			pushTargeItem(resData, pages, 3);
    		}
    		return resData;
    	}
    	function pushTargeItem(targetItems, items, type){
			for(var i=0; i<items.length; i++){
				if(items[i].url && items[i].url != "" ){
					var item = {};
					item.type = type;
					if(items[i].url && items[i].url != ""){
						item.targetHtml = items[i].url;
					}
					if(items[i].requireJS && items[i].requireJS.length >0){
						item.targetJs = items[i].requireJS;
					}
					else{
						item.targetJs = [];
					}
					item.seqId = items[i].seqId;
					targetItems.push(item);
				}
			}
    	}
    	
    	
    	function findRoot(data){
    		if(data.menus){
    			var root=[];
    			for(var i=0; i<data.menus.length; i++){
    				if(data.menus[i].isRoot == true){
    					root.push(data.menus[i]);
    				}
    			}
    			return root;
    		}
    	}
    	
    	function loadTree(data){
    		var root = findRoot(data);
    		loadMenuTree(root, data.menus)
    		return root;
    	}
    	
    	
    	function loadMenuTree(node, menus){
    		
			for(var i=0; i<menus.length; i++){
				
				if(node.seqId == menus[i].parentId){
					//找到子节点
					if(menus[i].isRoot == false && menus[i].isLeaf == false){
					   	//二级节点
						pushItem(node, menus[i]);
						loadMenuTree(menus[i], menus);
					}
					else if(menus[i].isRoot == false && menus[i].isLeaf == true){
						//子节点
						pushItem(node, menus[i]);

					}else {
						//即是根节点又是叶子节点？
						pushItem(node, menus[i]);
					}
					
				}
			}
    	}
    	function pushItem(node, ele){
			if(node.children && node.children.length > 0){
				node.children.push(ele);
			}
			else{
				node.children = [];
				node.children.push(ele);
			}
    	}
    	

    }]);