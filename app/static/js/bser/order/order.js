/* ======== 从订单列表中找出 订单 ======== */
let getOrderFromOrders = function(orderId) {
	let order = null;
	for(let i = 0; i<orders.length; i++){
		if(orders[i]._id == orderId) {
			order = orders[i];
			break;
		}
	}
	return order;
}

/* ============== 显示订单详细信息 ============== */
let bsOrderShow = function(order) {
	let str = '<div class="bsOrder_class">'
		str += '<div style="height:50px"></div>'
		/* ---------- 客户 订单号 显示操作按钮 --------- */
		str += '<div class="row">';
			str += '<div class="col-4 text-info p-2">'
				// console.log(order)
				if(order.cter){
					str += order.cter.nome
				}
				else{
					str += '散客'
				}
				str += ' <span class="oi oi-person"></span>'
			str += '</div>'
			str += '<div class="col-8 text-right bsOrder_optionShow">'
				str += '<h4 class="text-info">'
					str += order.code+' &nbsp; <span class="oi oi-chevron-bottom"></span>'
				str += '</h4>';
			str += '</div>'
			str += '<div class="col-8 text-right bsOrder_optionHide" style="display:none">'
				str += '<h4 class="text-info">'
					str += order.code+' &nbsp; <span class="oi oi-chevron-top"></span>'
				str += '</h4>';
			str += '</div>'
		str += '</div>'

		str += '<div class="row bsOrder_optionPage" style="display:none">';
			str += '<div class="col-4 mt-3">'
			str += '</div>'
			str += '<div class="col-4 mt-3">'
				str += '<button class="btn btn-warning btn-block bsOrder_copyOrder" type="button" '
				str += 'data-id='+order._id+'>复制 </button>'
			str += '</div>'
			str += '<div class="col-4 mt-3">'
				str += '<button class="btn btn-warning btn-block bsOrder_upOrder" type="button" '
				str += 'data-id='+order._id+'> 更新</button>'
			str += '</div>'
			str += '<div class="col-4 mt-3">'
				str += '<button class="btn btn-danger bsOrder_delBtn" '
				str += 'data-id='+order._id+' type="button"> 删除 </button>'
			str += '</div>'
			str += '<div class="col-4 mt-3">'
			str += '</div>'
			str += '<div class="col-4 mt-3">'
				str += '<a class="btn btn-warning" '
				str += 'href=/OrderExcel/'+order._id+'> 下载Excel </a>'
			str += '</div>'
		str += '</div>'

		/* ------------------------------ note ----------------------------- */
		if(order.note) {
			str += '<div class="row my-3">';
				str += '<div class="col-12 my-3 bg-light">'
					str += order.note
				str += '</div>'
			str += '</div>'
		}

		/* ------------------ 产品基本信息 ------------------ */
		str += '<table class="table table-borderless border border-dark my-3">';
			str += '<tr>'
				str += '<th class="border border-dark"> Code </th>'
				str += '<th class="border border-dark" colspan="2"> Desc </th>'
				str += '<th class="border border-dark text-right"> QNT </th>'
				str += '<th class="border border-dark text-right"> Prezzo </th>'
				str += '<th class="border border-dark text-right"> Total(€) </th>'
			str += '</tr>'
			let firLen = order.ordfirs.length;
			let pieces = 0;
			for(let i=0; i<firLen; i++) {
				let ordfir = order.ordfirs[i];
				pieces += ordfir.quot;
				str += '<tr>'
					if(ordfir.pdfir) {
						let pdfir = ordfir.pdfir;
						str += '<td>'+pdfir.code+'</td>';
						let pdname = pdfir.nome;
						if(pdname && pdname.length > 5){
							pdname = pdname.slice(0,3)+'...';
						}
						str += '<td colspan="2">'+pdname+'</td>'
					} else {
						str += '<td colspan="3">模特已删除</td>'
					}
					str += '<td class="text-right">'+ordfir.quot+'</td>'
					str += '<td class="text-right">'+Math.round(ordfir.price * 100)/100+'</td>'
					str += '<td class="text-right">'+Math.round(ordfir.price*ordfir.quot * 100)/100+'</td>'
				str += '</tr>'
			}
			str += '<tr>'
				str += '<th colspan="2" class="border border-dark"> TOT: '+firLen+'</th>'
				str += '<th colspan="2" class="border border-dark text-right">'+pieces+' pz</th>'
				str += '<th colspan="2" class="border border-dark text-right"> IMP: '+Math.round(order.pdPr * 100)/100+' €</th>'
			str += '</tr>'
		str += '</table>'
		str += '<div class="row">'
			str += '<div class="col-6"> 原价: '
				str += Math.round(order.real * 100)/100
			str += ' €</div>'
			str += '<div class="col-6 text-right"> 实收'
				str += Math.round(order.imp * 100)/100
			str += ' €</div>'
		str += '</div>'

		str += '<div style="height:100px"></div>'
		for(let i=0; i<firLen; i++) {
			let ordfir = order.ordfirs[i];
			pieces += ordfir.quot;
			str += '<div class="row mt-2 bg-light py-2">'
				let pdfir = new Object();
				pdfir.photo = '/1.jpg'
				pdfir.code = '模特已删除'
				if(ordfir.pdfir) {
					pdfir = ordfir.pdfir;
				}
				str += '<div class="col-4">'
					str += '<img src="' + pdfir.photo +'" width="100%" ';
					str += 'style="max-width:100px;max-height:100px;"'
					str += ' alt="'+pdfir.code+'" />';
				str += '</div>'
				str += '<div class="col-8">'
					str += '<div class="row">'
						str += '<h3 class="col-6">'+pdfir.code+'</h3>'
						str += '<h4 class="col-6 text-right">'+pdfir.nome+'</h4>'
						str += '<div class="col-12 text-right">'
							str += ordfir.quot+'pz * '
							str += Math.round(ordfir.price * 100)/100+'€ = &nbsp; &nbsp;'
							str += Math.round(ordfir.price*ordfir.quot * 100)/100+'€'
						str += '</div>'
					str += '</div>'
				str += '</div>'
			str += '</div>'
		}
		str += '<div style="height:100px"></div>'

		// str += '<div style="height: 200px"></div>'
		// str += '<div class="row">'
		// 	str += '<div class="col-8">'
		// 	str += '</div>'
		// 	str += '<div class="col-4 text-right">'
		// 		str += '<button class="btn btn-danger bsOrder_delBtn" '
		// 		str += 'data-id='+order._id+' type="button"> 删除 </button>'
		// 	str += '</div>'
		// str += '</div>'
		
		str += '<div class="topNav-second pt-2">'
			str += '<div class="row pl-2">';
				str += '<div class="col-4">'
					str += '<button class="btn btn-info bsOrders_btn" type="button">';
						str += '<span class="oi oi-arrow-thick-left"></span>'
					str += '</button>'
				str += '</div>'
				str += '<div class="col-4">'
					str += '<button class="btn btn-link btn-block printStamp" type="button" '
					str += 'data-id='+order._id+'>打印 <span class="oi oi-print"></span></button>'
				str += '</div>'
				str += '<div class="col-4">'
					str += '<button class="btn btn-link btn-block printTicket" type="button" '
					str += 'data-id='+order._id+'>小票 <span class="oi oi-print"></span></button>'
				str += '</div>'
			str += '</div>'
		str += '</div>'

	str += '</div>'

	$(".page").hide();
	$("#bsOrder_page").show();

	$(".bsOrder_class").remove();
	$("#bsOrder_page").append(str);
}

$(function() {
	/* ============= 在订单列表页， 点击 进入订单详情页 ============= */
	$("#bsOrders_page_elem").on('click', '.orderCard', function(e) {
		let orderId = $(this).attr("id").split('-')[1];
		let order = getOrderFromOrders(orderId);
		bsOrderShow(order)
	})

	/* ======== 在 订单详情页面 点击删除按钮 删除订单 ======== */
	$("#bsOrder_page").on('click', '.bsOrder_delBtn', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');
		// console.log(orderId)
		$.ajax({
			type: "GET",
			url: '/bsOrderDel?orderId='+orderId,
			success: function(results) {
				if(results.success == 1) {
					ajaxGetOrders();
					bsOrdersShow(orders)
				} else {
					alert(results.info);
				}
			}
		});
	})

	/* ===== 在订单详情页 点击 bsOrders_btn 按钮 返回订单列表页面 =====*/
	$("#bsOrder_page").on('click', '.bsOrders_btn', function(e) {
		ajaxGetOrders();
	})

	$("#bsOrder_page").on('click', '.printTicket', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');
		$.ajax({
			type: 'GET',
			url: '/bsOrderTicketing?orderId=' + orderId + '&newTicket=1'
		})
		.done(function(results) {
			if(results.success === 1) {
				alert("正在打印")
			} else if(results.success === 0) {
				alert(results.info)
			}
		})
	})

	/* ======== 在 订单详情页面 点击打印机打印 ======== */
	$("#bsOrder_page").on('click', '.printStamp', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');
		$.ajax({
			type: 'GET',
			url: '/bsOrderStamping?orderId=' + orderId + '&newStamp=1'
		})
		.done(function(results) {
			if(results.success === 1) {
				alert("正在打印")
			} else if(results.success === 0) {
				alert(results.info)
			}
		})
	})

	/* =============== 在订单详情页中点击显示操作 按钮 =========== */
	$("#bsOrder_page").on('click', '.bsOrder_optionShow', function(e) {
		$(".bsOrder_optionShow").hide();
		$(".bsOrder_optionHide").show();
		
		$(".bsOrder_optionPage").show();
	})
	/* =============== 在订单详情页中点击隐藏操作 按钮 =========== */
	$("#bsOrder_page").on('click', '.bsOrder_optionHide', function(e) {
		$(".bsOrder_optionHide").hide();
		$(".bsOrder_optionShow").show();
		
		$(".bsOrder_optionPage").hide();
	})

	/* ======== 在 订单详情页面 点击更新按钮 更新订单 ======== */
	$("#bsOrder_page").on('click', '.bsOrder_upOrder', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');

		window.location.href = "/order?orderId="+orderId+"&opt=upd";
	})
	$("#bsOrder_page").on('click', '.bsOrder_copyOrder', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');

		window.location.href = "/order?orderId="+orderId+"&opt=copy";
	})
})