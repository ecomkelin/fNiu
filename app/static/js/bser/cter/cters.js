/* ------------------------------- 获取 url 中的参数 -------------------------------- */
let nowUrl = window.location.href;
let getUrlParam = function(name) {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	let r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
let init = function() {
	let sortBy = getUrlParam('sortBy');
	let sortVal = getUrlParam('sortVal');
	if(sortBy && sortVal) {
		$("#sortSelect").val(sortBy+'_'+sortVal)
	}

	let isPhoto = getUrlParam('isPhoto');
	if(isPhoto) {
		$("#isPhoto").val(isPhoto);
	}
}

let showAjaxCters = function(matchCters) {
	let str = '<div class="ajaxCters_class">'
	for(let i=0; i<matchCters.length; i++) {
		cter = matchCters[i];
		str += '<div class="card mt-3 p-2 bsCters_cter" id="bsAjaxCters_cter-'+cter._id+'">'
			str += '<div class="row">'
				str += '<div class="col-4 border-right">'
				str += '<div class="row text-center pl-3">'
					str += '<div class="col-12">N.'+(i+1)+'</div>';
					str += '<img class="card-img ml-1" src='+cter.photo;
					str += ' width="100%" style="max-width: 90px; max-height: 120px"/>';
				str += '</div>';
				str += '</div>';
				str += '<div class="col-8">'
					str += '<div class="row">'

						str += '<h4 class="col-6 text-left">'+cter.code+'</h4>';

						str += '<h5 class="col-6 text-right">'+cter.nome+'</h5>';

						str += '<div class="col-5 text-right">售价: </div>';
						str += '<div class="col-7 text-left">'+cter.price+'</div>';

						str += '<div class="col-5 text-right">销量: </div>';
						str += '<div class="col-7 text-left">'+cter.sales+'</div>';

						str += '<div class="col-5 text-right">库存: </div>';
						str += '<div class="col-7 text-left">'+cter.stock+'</div>';

					str += '</div>';
				str += '</div>';
			str += '</div>';

			str += '<div class="row">';
				str += '<div class="col-12 text-right">';
					str += '<button class="btn btn-danger delAjax" data-id='+cter._id;
					str += ' type="button" style="display:none">Del</button>';
				str += '</div>';
			str += '</div>';
		str += '</div>';
	}
	str += '</div>'

	$(".page").hide();
	$("#ajaxCters_page").show();

	$(".ajaxCters_class").remove();
	$("#ajaxCters_page").append(str);
}

$(function() {
	init();

	$(".selectPd").change(function(e) {
		let sort = $("#sortSelect").val().split('_');
		let sortBy = sort[0];
		let sortVal = sort[1];

		let isPhoto = $("#isPhoto").val();

		console.log(sortBy)
		console.log(sortVal)
		console.log(isPhoto)
		window.location.href = "/bsCters?sortBy="+sortBy+'&sortVal='+sortVal+'&isPhoto='+isPhoto;
	})

	$("#cterCodeNav").on('input', '#cterCodeAjax', function(e) {
		let str = $(this).val().replace(/\s+/g,"").toUpperCase();
		if(str.length > 0) {
			let keyword = encodeURIComponent(str);	// 转化码
			$.ajax({
				type: 'get',
				url: '/bsCtersAjax?code='+keyword
			})
			.done(function(results) {
				if(results.success == 1) {
					let cters = results.cters;
					let matchCters = new Array();
					for (let i=0; i<cters.length; i++) {
						if(cters[i].code == str) {
							matchCters.unshift(cters[i])
						}
						else if ((cters[i].code).split(str).length > 1) {
							matchCters.push(cters[i]);
						}
					}
					showAjaxCters(matchCters);
				} else {
					alert(results.info)
				}
			})
		} else {
			$(".page").hide();
			$("#bsCters_page").show();
		}
	})

	$(".page").on('click', '.bsCters_cter', function(e) {
		let cterId = $(this).attr("id").split("-")[1];
		window.location.href = "/bsCter/"+cterId;
	})
})