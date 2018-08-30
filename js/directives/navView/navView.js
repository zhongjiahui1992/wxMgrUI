var cjhmeUI = angular.module('app');

/**
 * 导航
 */
cjhmeUI.directive('cjhmeNavView', [function() {

	return {
		restrict: 'E',
        replace : true,
		templateUrl: 'js/directives/navView/navView.html',
		scope: {
			navData: '=',
			itemClicked: '&'
		},
		link: function($scope, $element, $attrs) {

			$scope.templateUrl = function() {
				return "js/directives/navView/navItem.html";
			}

			$scope.itemExpended = function(item, $event) {
				item.isExpend = !item.isExpend;
				$event.stopPropagation();
			};
			$scope.isLeaf = function(item) {
				return !item.children || !item.children.length;
			};
			$scope.warpCallback = function(callback, item, $event) {
				//存在子节点，展开
				if(!$scope.isLeaf(item)) {
					$scope.itemExpended(item, $event);
				} else {
					($scope[callback] || angular.noop)({
						$item: item,
						$event: $event
					});
				}

			};

		}
	};
}]);
