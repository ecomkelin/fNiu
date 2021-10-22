let updateShow = function() {
	$(".page").hide();
	$("#update_elem").show();

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
let pdAjaxShow = function() {
	$(".page").hide();
	$("#pdAjax_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#sales_btn").removeClass("bg-secondary");
	$("#sales_btn").addClass("bg-info");
}
let czAjaxShow = function() {
	$(".page").hide();
	$("#cz_elem").show();

	$(".bomBtn").removeClass("bg-info");
	$(".bomBtn").addClass("bg-secondary");
	$("#cz_btn").removeClass("bg-secondary");
	$("#cz_btn").addClass("bg-info");
}


let pdOrdfirsPage = function(selFirs) {
	let str = '<div class="selFirs_class mt-5">';

	str += '<table class="table table-bordered my-3">';
		str += '<tr>'
			str += '<th> 客户 </th>'
			str += '<th> 数量 </th>'
			str += '<th> 价格 </th>'
			str += '<th> 时间 </th>'
		str += '</tr>'
		let totQuot = 0, totPrice = 0;
		for(let i=0; i<selFirs.length; i++) {
			let cterNome = '散客';
			if(selFirs[i].cter) {
				cterNome = selFirs[i].cter.nome;
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
				str += '<td>'+cterNome+'</td>'
				str += '<td>'+quot+'</td>'
				str += '<td>'+price.toFixed(2)+'</td>'
				str += '<td>'+ctAt.getFullYear()+'年'+(ctAt.getMonth()+1)+'月'+ctAt.getDate()+'日</td>'
			str += '</tr>'
		}
		str += '<tr>'
			str += '<th> 总数 </th>'
			str += '<th>'+totQuot+'</th>'
			str += '<th>'+totPrice.toFixed(2)+'</th>'
			str += '<th></th>'
		str += '</tr>'
	str += '</table>'		

	str += '</div>'
	$('.selFirs_class').remove();
	$("#pdAjax_div").append(str);

	
}
let appendCterNome = function() {
	let str = '';
	str += '<option class="cter_class" value=-1>'
		str += '全部客户';
	str += '</option>'
	for(let i=0; i<ctfirs.length; i++) {
		let ctfir = ctfirs[i];
		str += '<option class="cter_class" value='+ctfir.nome+'>'
			str += ctfir.nome;
		str += '</option>'
	}
	$(".cter_class").remove();
	$("#cterNome").append(str);
}
let pdCtfirsPage = function() {
	let str = '<div class="ctfirs_class mt-5">';

	str += '<table class="table table-bordered my-3">';
		str += '<tr>'
			str += '<th> 客户 </th>'
			str += '<th> 数量 </th>'
			str += '<th> 金额 </th>'
		str += '</tr>'
		let totQuot = 0, totPrice=0;
		for(let i=0; i<ctfirs.length; i++) {
			// if(!isNaN(parseInt(ctfirs[i].quot))) {
			// 	totQuot += parseInt(ctfirs[i].quot);
			// }
			// if(!isNaN(parseFloat(ctfirs[i].price))) {
			// 	totPrice += parseInt(ctfirs[i].price);
			// }
			str += '<tr>'
				str += '<td>'+ctfirs[i].nome+'</td>'
				str += '<td>'+ctfirs[i].quot+'</td>'
				str += '<td>'+ctfirs[i].price.toFixed(2)+'</td>'
			str += '</tr>'
		}
		// str += '<tr>'
		// 	str += '<th> 总数 </th>'
		// 	str += '<th>'+totQuot+'</th>'
		// 	str += '<th>'+totPrice+'</th>'
		// str += '</tr>'
	str += '</table>'		

	str += '</div>'
	$('.ctfirs_class').remove();
	$("#pdAjaxCter_div").append(str);
}

let ordfirs = new Array();
let ctfirs = new Array();
let ajaxGetPdOrdfirs = function(pdfirId) {
	// let valAtFm = encodeURIComponent(atFm);
	// let valAtTo = encodeURIComponent(atTo);
	$.ajax({
		type: "GET",
		// url: '/bsOrdfirsPd?pdfirId='+pdfir._id+'&atFm='+valAtFm+'&atTo='+valAtTo,
		url: '/bsOrdfirsPd?pdfirId='+pdfirId,
		success: function(results) {
			if(results.success == 1) {
				ordfirs = results.ordfirs;	// 重新加载 ordfirs 数据
				// let selFirs = JSON.parse(JSON.stringify(ordfirs));
				ctfirs = new Array();
				for (let i=0; i<ordfirs.length; i++) {
					let nome = '散客';
					if(ordfirs[i].cter) {
						nome = ordfirs[i].cter.nome;
					}
					let j=0;
					let quot = parseInt(ordfirs[i].quot);
					let price = parseFloat(ordfirs[i].price);
					if(!isNaN(quot) && !isNaN(price)) {
						price = price * quot;
					}
					for(; j<ctfirs.length; j++) {
						if(nome == ctfirs[j].nome) {
							ctfirs[j].quot += quot;
							ctfirs[j].price += price;
							break;
						}
					}
					if(j == ctfirs.length) {
						let ctfir = new Object();
						ctfir.nome = nome;
						ctfir.quot = quot;
						ctfir.price = price;
						if(nome == '散客'){
							ctfirs.unshift(ctfir);
						} else {
							ctfirs.push(ctfir);
						}
					}
				}
				pdOrdfirsPage(ordfirs);				// 界面显示 ordfirs
				appendCterNome();
				pdCtfirsPage();
			} else {
				alert(results.info);
			}
		}
	});
}

$(function() {
	let init = function() {
		let pdfirId = $("#pdfirId").val();
		ajaxGetPdOrdfirs(pdfirId);
	}
	init();

	$("#upBtn").click(function(e) {
		updateShow();
	})
	$(".cnlBtn").click(function(e) {
		basicShow();
	})
	$("#basic_btn").click(function(e) {
		basicShow();
	})
	$("#sales_btn").click(function(e) {
		pdAjaxShow();
	})
	$("#ctfirs_btn").click(function(e) {
		$(".page").hide();
		$("#pdAjaxCter_elem").show();
	})
	$("#sale_btn").click(function(e) {
		$(".page").hide();
		$("#pdAjax_elem").show();
	})
	$("#cz_btn").click(function(e) {
		czAjaxShow();
	})

	$("#cterNome").change(function(e) {
		let cterNome = $("#cterNome").val();
		let selFirs = ordfirs;

		let temps = JSON.parse(JSON.stringify(selFirs));
		/* ============= 客户选择 ============= */
		if(cterNome != -1) {
			selFirs = new Array();
			for(let i=0; i<temps.length; i++) {
				if(cterNome == '散客' && !temps[i].cter) {
					selFirs.push(temps[i]);
				}
				if(cterNome != '散客' && temps[i].cter && temps[i].cter.nome == cterNome) {
					selFirs.push(temps[i])
				}
			}
		}

		// let temps = JSON.parse(JSON.stringify(selFirs));
		// /* ============= 时间选择 ============= */
		// if(cterNome != -1) {
		// 	selFirs = new Array();
		// 	for(let i=0; i<temps.length; i++) {
		// 		if(cterNome == '散客' && !temps[i].cter) {
		// 			selFirs.push(temps[i]);
		// 		}
		// 		if(cterNome != '散客' && temps[i].cter && temps[i].cter.nome == cterNome) {
		// 			selFirs.push(temps[i])
		// 		}
		// 	}
		// }

		pdOrdfirsPage(selFirs)
	})
	$("#ordTime").change(function(e) {
		let ordTime = $(this).val();
		$("#customizeNav").hide();
		if(ordTime == 0) {
			$("#customizeNav").show();
		} else {

		}
	})
})