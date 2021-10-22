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

	let selBy = getUrlParam('selBy');
	let selVal = getUrlParam('selVal');
	if(selBy) {
		$("#isSel").val(selBy+'_'+selVal);
	}
}

let showAjaxPds = function(matchPds) {
	let str = '<div class="ajaxPds_class">'
	for(let i=0; i<matchPds.length; i++) {
		pdfir = matchPds[i];
		str += '<div class="card mt-3 p-2 bsPdfirs_pdfir" id="bsAjaxPds_pdfir-'+pdfir._id+'">'
			str += '<div class="row">'
				str += '<div class="col-4 border-right">'
				str += '<div class="row text-center pl-3">'
					str += '<div class="col-12">N.'+(i+1)+'</div>';
					str += '<img class="card-img ml-1" src="'+pdfir.photo;
					str += '" width="100%" style="max-width: 90px; max-height: 120px"/>';
				str += '</div>';
				str += '</div>';
				str += '<div class="col-8">'
					str += '<div class="row">'

						str += '<h4 class="col-6 text-left">'+pdfir.code+'</h4>';

						str += '<h5 class="col-6 text-right">'+pdfir.nome+'</h5>';

						str += '<div class="col-5 text-right">售价: </div>';
						str += '<div class="col-7 text-left">'+pdfir.price+'</div>';

						str += '<div class="col-5 text-right">销量: </div>';
						str += '<div class="col-7 text-left">'+pdfir.sales+'</div>';

						str += '<div class="col-5 text-right">库存: </div>';
						str += '<div class="col-7 text-left">'+pdfir.stock+'</div>';

					str += '</div>';
				str += '</div>';
			str += '</div>';

			str += '<div class="row">';
				str += '<div class="col-12 text-right">';
					str += '<button class="btn btn-danger delAjax" data-id='+pdfir._id;
					str += ' type="button" style="display:none">Del</button>';
				str += '</div>';
			str += '</div>';
		str += '</div>';
	}
	str += '</div>'

	$(".page").hide();
	$("#ajaxPds_page").show();

	$(".ajaxPds_class").remove();
	$("#ajaxPds_page").append(str);
}

$(function() {
	init();

	$(".selectPd").change(function(e) {
		let sort = $("#sortSelect").val().split('_');
		let sortBy = sort[0];
		let sortVal = sort[1];

		let sel = $("#isSel").val().split('_');
		let selBy = sel[0];
		let selVal = sel[1];

		let newUrl ="/bsPdfirs?"
		newUrl += 'sortBy='+sortBy;
		newUrl += '&sortVal='+sortVal;
		newUrl += '&selBy='+selBy;
		newUrl += '&selVal='+selVal;
		window.location.href = newUrl;
	})

	$("#pdCodeNav").on('input', '#pdCodeAjax', function(e) {
		let str = $(this).val().replace(/\s+/g,"").toUpperCase();
		if(str.length > 0) {
			let keyword = encodeURIComponent(str);	// 转化码
			$.ajax({
				type: 'get',
				url: '/bsPdfirsAjax?code='+keyword
			})
			.done(function(results) {
				if(results.success == 1) {
					let pdfirs = results.pdfirs;
					let matchPds = new Array();
					for (let i=0; i<pdfirs.length; i++) {
						if(pdfirs[i].code == str) {
							matchPds.unshift(pdfirs[i])
						}
						else if ((pdfirs[i].code).split(str).length > 1) {
							matchPds.push(pdfirs[i]);
						}
					}
					showAjaxPds(matchPds);
				} else {
					alert(results.info)
				}
			})
		} else {
			$(".page").hide();
			$("#bsPdfirs_page").show();
		}
	})

	$(".page").on('click', '.bsPdfirs_pdfir', function(e) {
		let pdfirId = $(this).attr("id").split("-")[1];
		window.location.href = "/bsPdfir/"+pdfirId;
	})
})