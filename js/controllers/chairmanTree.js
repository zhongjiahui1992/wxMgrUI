var setting = {
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			}
		};

		var zNodes =[
			{ id:1, pId:0, name:"水利局", open: true },
			{ id:11, pId:1, name:"河长办"},
			{ id:111, pId:11, name:"钱塘江河长办"},
			{ id:1111, pId:111, name:"暨军民"},
			{ id:1111, pId:111, name:"李一飞"},
			{ id:1111, pId:111, name:"金中梁"},
			{ id:112, pId:11, name:"杭州市河长办"},
			{ id:1121, pId:112, name:"张耕"},
			{ id:1122, pId:112, name:"佟桂莉"},
			{ id:1123, pId:112, name:"徐文光"},
			{ id:113, pId:11, name:"金华市河长办"},
			{ id:1131, pId:113, name:"谢双成"},
			{ id:1132, pId:113, name:"杨旭标"},
			{ id:1133, pId:113, name:"翁卫军"},
			{ id:12, pId:1, name:"杭州市水利局"},
			{ id:121, pId:12, name:"污防处"},
			{ id:122, pId:12, name:"黄旭明"},
			{ id:123, pId:12, name:"程渭山"}
		];
		
		var code;
		
		function setCheck() {
			var zTree = $.fn.zTree.getZTreeObj("chairmanTree"),
			py = $("#py").attr("checked")? "p":"",
			sy = $("#sy").attr("checked")? "s":"",
			pn = $("#pn").attr("checked")? "p":"",
			sn = $("#sn").attr("checked")? "s":"",
			type = { "Y":py + sy, "N":pn + sn};
			zTree.setting.check.chkboxType = type;
			showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
		}
		function showCode(str) {
			if (!code) code = $("#code");
			code.empty();
			code.append("<li>"+str+"</li>");
		}
		
		$(document).ready(function(){
			$.fn.zTree.init($("#chairmanTree"), setting, zNodes);
			setCheck();
			$("#py").bind("change", setCheck);
			$("#sy").bind("change", setCheck);
			$("#pn").bind("change", setCheck);
			$("#sn").bind("change", setCheck);
		});