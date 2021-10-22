$(function() {
	let colorNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	var judgeColorFunc = function(color) {
		let info = null;
		if(!color) {
			info = "请填写颜色";
		} else if(color.length != 3 && color.length !=6) {
			info = "必须是3或6个字符";
		} else {
			for(let i=0; i<color.length; i++) {
				let chart = color[i]
				if(!colorNum.includes(chart)) {
					info = "字符必须是 0-9 或 A-F";
					break;
				}
			}
		}
		return info;
	}
	$("#codeIpt").blur(function(e) {
		$(".color").remove();
		let color = $("#codeIpt").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		let info = judgeColorFunc(color);
		if(info) {
			alert(info)
		} else {
			let elem = "";
			elem += '<div class="color" style="background-color:#'+color+'; height: 30px"><div>'
			$("#showColorCard").append(elem)
		}
	})
	$("#bsProdNew").submit(function(e) {
		let color = $("#codeIpt").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		let info = judgeColorFunc(color);
		if(info) {
			alert(info)
			e.preventDefault();
		}
	})
})