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
			{ id:1, pId:0, name:"浙江省", open: true },
			{ id:11, pId:1, name:"杭州市"},
			{ id:111, pId:11, name:"滨江区"},
			{ id:1111, pId:111, name:"西兴街道"},
			{ id:1111, pId:111, name:"长河街道"},
			{ id:1111, pId:111, name:"浦沿街道"},
			{ id:112, pId:11, name:"萧山区"},
			{ id:1121, pId:112, name:"北干街道"},
			{ id:1122, pId:112, name:"城厢街道"},
			{ id:1123, pId:112, name:"蜀山街道"},
			{ id:113, pId:11, name:"西湖区"},
			{ id:1131, pId:113, name:"灵隐街道"},
			{ id:1132, pId:113, name:"西溪街道"},
			{ id:1133, pId:113, name:"翠苑街道"},
			{ id:12, pId:1, name:"金华市"},
			{ id:121, pId:12, name:"义乌市"},
			{ id:1211, pId:121, name:"稠城街道"},
			{ id:1212, pId:121, name:"北苑街道"},
			{ id:1213, pId:121, name:"江东街道"},
			{ id:122, pId:12, name:"永康市"},
			{ id:1221, pId:122, name:"石柱街道"},
			{ id:1222, pId:122, name:"前仓街道"},
			{ id:1223, pId:122, name:"龙山街道"},
			{ id:123, pId:12, name:"婺城区"},
			{ id:1231, pId:123, name:"城东街道"},
			{ id:1232, pId:123, name:"江南街道"},
			{ id:1233, pId:123, name:"三江街道"},
		];
		
		var code;
		
		function setCheck() {
			var zTree = $.fn.zTree.getZTreeObj("regionTree"),
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
			$.fn.zTree.init($("#regionTree"), setting, zNodes);
			setCheck();
			$("#py").bind("change", setCheck);
			$("#sy").bind("change", setCheck);
			$("#pn").bind("change", setCheck);
			$("#sn").bind("change", setCheck);
		});