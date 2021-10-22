$( function() {
	

} );
let selfInfo = JSON.parse($("#bsMyInfo").val());

let selfInfoShow = function() {
	let str = '<div class="selfInfo_class">';

	/* ------------------ 用户基本信息 ------------------ */
	str += '<table class="table table-bordered my-3">';
		str += '<tr>'
			str += '<td> 帐号 </td>'
			str += '<td>'+selfInfo.code+'</td>'
		str += '</tr>'
		str += '<tr>'
			str += '<td> 代号 </td>'
			str += '<td>'+selfInfo.cd+'</td>'
		str += '</tr>'
		str += '<tr>'
			str += '<td> 名字 </td>'
			str += '<td>'+selfInfo.nome+'</td>'
		str += '</tr>'
		str += '<tr>'
			str += '<td> 角色 </td>'
			str += '<td>'+Conf.usRole[selfInfo.role]+'</td>'
		str += '</tr>'
		str += '<tr>'
			str += '<td> 最近登录 </td>'
			let lgAt = new Date(selfInfo.lgAt);
			str += '<td>'+lgAt.getYear()+'年'+(lgAt.getMonth()+1)+'月'+lgAt.getDate()
			str += '日 '+lgAt.getHours()+':'+lgAt.getMinutes() + ':'+lgAt.getSeconds()+'</td>'
		str += '</tr>'
	str += '</table>'

	/* --------------- 跳转 --------------- */
	str += '<div class="row my-5">'
		str += '<div class="col-6">'
			str += '<a class="btn btn-danger" href="/logout"> 退出登录 </a>'
		str += '</div>'
		str += '<div class="col-6 text-right">'
			if(selfInfo.role == 1) {
				str += '<a class="btn btn-info" href="/bser"> 管理 </a>'
			}
		str += '</div>'
	str += '</div>'

	str += '</div>'


	$('.selfInfo_class').remove();
	$("#bsSelf_page").append(str)

	$('.page').hide();
	$("#bsSelf_page").show();
}