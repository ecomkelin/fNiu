let updateShow = function() {
	$(".page").hide();
	$("#update_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#basic_btn").removeClass("bg-secondary");
	$("#basic_btn").addClass("bg-info");
}
let updLoginShow = function() {
	$(".page").hide();
	$("#updLogin_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#basic_btn").removeClass("bg-secondary");
	$("#basic_btn").addClass("bg-info");
}
let basicShow = function() {
	$(".page").hide();
	$("#basic_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#basic_btn").removeClass("bg-secondary");
	$("#basic_btn").addClass("bg-info");
}
let cterOrdfirShow = function() {
	$(".page").hide();
	$("#ordfirs_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#ordfirs_btn").removeClass("bg-secondary");
	$("#ordfirs_btn").addClass("bg-info");
}
let ctPdfirsShow = function() {
	$(".page").hide();
	$("#cterPdfir_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#ctPdfirs_btn").removeClass("bg-secondary");
	$("#ctPdfirs_btn").addClass("bg-info");
}
let cterOrderShow = function() {
	$(".page").hide();
	$("#orders_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#order_btn").removeClass("bg-secondary");
	$("#order_btn").addClass("bg-info");
}






let pdOrdfirsPage = function(selFirs) {
	let str = '<div class="selFirs_class mt-5">';

	str += '<table class="table table-bordered my-3">';
		str += '<tr>'
			str += '<th> 模特 </th>'
			str += '<th> 数量 </th>'
			str += '<th> 价格 </th>'
			str += '<th> 时间 </th>'
		str += '</tr>'
		let totQuot = 0, totPrice = 0;
		for(let i=0; i<selFirs.length; i++) {
			let pdCode = '散客';
			if(selFirs[i].pdfir) {
				pdCode = selFirs[i].pdfir.code;
			}
			let quot = parseInt(selFirs[i].quot);
			let price = parseFloat(selFirs[i].price);
			if(!isNaN(quot) && !isNaN(price)) {
				price = price * quot;
				totQuot += quot;
				totPrice += price;
			}
			let ctAt = new Date(selFirs[i].ctAt);

			str += '<tr>'
				str += '<td>'+pdCode+'</td>'
				str += '<td>'+quot+'</td>'
				str += '<td>'+price+'</td>'
				str += '<td>'+ctAt.getFullYear()+'年'+(ctAt.getMonth()+1)+'月'+ctAt.getDate()+'日</td>'
			str += '</tr>'
		}
		str += '<tr>'
			str += '<th> 总数 </th>'
			str += '<th>'+totQuot+'</th>'
			str += '<th>'+totPrice+'</th>'
			str += '<th></th>'
		str += '</tr>'
	str += '</table>'		

	str += '</div>'
	$('.selFirs_class').remove();
	$("#ordfirsAjax_div").append(str);	
}


let cterPdsPage = function() {
	let str = '<div class="ctpds_class mt-5">';

	str += '<table class="table table-bordered my-3">';
		str += '<tr>'
			str += '<th> 模特 </th>'
			str += '<th> 数量 </th>'
			str += '<th> 金额 </th>'
		str += '</tr>'
		let totQuot = 0, totPrice=0;
		for(let i=0; i<ctpds.length; i++) {
			str += '<tr>'
				str += '<td>'+ctpds[i].code+'</td>'
				str += '<td>'+ctpds[i].quot+'</td>'
				str += '<td>'+ctpds[i].price+'</td>'
			str += '</tr>'
		}
	str += '</table>'		

	str += '</div>'
	$('.ctpds_class').remove();
	$("#cterPdfir_elem").append(str);
}

let ordfirs = new Array();
let ctpds = new Array();
let ajaxGetCtOrdfirs = function(cterId) {
	// let valAtFm = encodeURIComponent(atFm);
	// let valAtTo = encodeURIComponent(atTo);
	$.ajax({
		type: "GET",
		// url: '/bsOrdfirsCt?cterId='+cter._id+'&atFm='+valAtFm+'&atTo='+valAtTo,
		url: '/bsOrdfirsCt?cterId='+cterId,
		success: function(results) {
			if(results.success == 1) {
				ordfirs = results.ordfirs;	// 重新加载 ordfirs 数据
				// let selFirs = JSON.parse(JSON.stringify(ordfirs));
				ctpds = new Array();
				for (let i=0; i<ordfirs.length; i++) {
					let code = '';
					if(ordfirs[i].pdfir) {
						code = ordfirs[i].pdfir.code;
					}
					let j=0;
					let quot = parseInt(ordfirs[i].quot);
					let price = parseFloat(ordfirs[i].price);
					if(!isNaN(quot) && !isNaN(price)) {
						price = price * quot;
					}
					for(; j<ctpds.length; j++) {
						if(code == ctpds[j].code) {
							ctpds[j].quot += quot;
							ctpds[j].price += price;
							break;
						}
					}
					if(j == ctpds.length) {
						let ctpd = new Object();
						ctpd.code = code;
						ctpd.quot = quot;
						ctpd.price = price;
						
						ctpds.push(ctpd);
					}
				}
				pdOrdfirsPage(ordfirs);				// 界面显示 ordfirs
				cterPdsPage();
			} else {
				alert(results.info);
			}
		}
	});
}

$(function() {
	let init = function() {
		let cterId = $("#cterId").val();
		ajaxGetCtOrdfirs(cterId);
	}
	init();

	$("#upBtn").click(function(e) {
		updateShow();
	})
	$("#upLoginBtn").click(function(e) {
		updLoginShow();
	})
	$(".cnlBtn").click(function(e) {
		basicShow();
	})
	$("#basic_btn").click(function(e) {
		basicShow();
	})
	$("#ordfirs_btn").click(function(e) {
		cterOrdfirShow();
	})
	$("#ctPdfirs_btn").click(function(e) {
		ctPdfirsShow();
	})
	$("#order_btn").click(function(e) {
		cterOrderShow();
	})

	/* ======== 输入模特号 查找客户购买的模特 ======== */
	$("#ordfirs_elem").on('input', '#pdCode', function(e) {
		let pdCode = $(this).val();
		// console.log(pdCode)
		// return;
		let selFirs = ordfirs;

		let temps = JSON.parse(JSON.stringify(selFirs));
		if(pdCode && pdCode.length >0) {
			selFirs = new Array();
			for(let i=0; i<temps.length; i++) {
				if(pdCode == temps[i].pdfir.code) {
					selFirs.unshift(temps[i]);
				}
				else if((temps[i].pdfir.code).split(pdCode).length > 1) {
					selFirs.push(temps[i]);
				}
			}
		} else {
			selFirs = temps;
		}
		pdOrdfirsPage(selFirs)
	})
	/* ===== 根据下单时间筛选 ===== */
	$("#ordfirTime").change(function(e) {
		let ordfirTime = $(this).val();
		$("#customizeOrdfirNav").hide();
		if(ordfirTime == 0) {
			$("#customizeOrdfirNav").show();
		} else {

		}
	})

	/* ===== 提交更改基本信息按钮 ===== */
	$("#subBtn").click(function(e) {
		let form = $("#bsCterUpdForm");
		let data = form.serialize();
		$.ajax({
			type: "POST",
			url: '/bsCterUpd',
			data: data,
			success: function(results) {
				if(results.success == 1) {
					location.reload();
				} else {
					alert(results.info);
				}
			}
		});
	})
	/* ===== 提交更改登录信息按钮 ===== */
	$("#subLoginBtn").click(function(e) {
		let form = $("#bsCterLoginForm");
		let data = form.serialize();
		$.ajax({
			type: "POST",
			url: '/bsCterUpdLogin',
			data: data,
			success: function(results) {
				if(results.success == 1) {
					location.reload();
				} else {
					alert(results.info);
				}
			}
		});
	})
})