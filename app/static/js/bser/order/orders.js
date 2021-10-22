let orders = new Array();
let selOrds = new Array();
let cters = new Array();

/* ============ 获取订单列表 ============ */
let ajaxGetOrders = function(cterId, userId) {
	let atFm = $("#atFm").val();
	let atTo = $("#atTo").val();
	let valAtFm = encodeURIComponent(atFm);
	let valAtTo = encodeURIComponent(atTo);
	let url = '/bsOrdersAjax?atFm=';
	url += valAtFm;
	url += '&atTo='+valAtTo;
	$.ajax({
		type: "GET",
		url: url,
		success: function(results) {
			if(results.success == 1) {
				orders = results.orders;	// 获取 orders 数据
				cters = new Array();
				for (let i=0; i<orders.length; i++) {
					if(orders[i].cter) {
						let j=0;
						for (; j<cters.length; j++) {
							if(cters[j]._id == orders[i].cter._id) {
								break;
							}
						}
						if(j == cters.length) {
							cters.push(orders[i].cter)
						}
					}
				}
				appendCters();
				selOrds = orders;
				$("#orderSts").val(-1);		// 前端状态显示为全部
				$("#userId").val(-1);		// 前端状态显示为全部
				$("#cterNome").val('');		// 前端状态显示为全部
				bsOrdersShow();				// 界面显示 selOrds
			} else {
				alert(results.info);
			}
		}
	});
}

/* ======== 初始函数 ======== */
let init = function() {
	let now = new Date();
	let year = now.getFullYear()
	let month = now.getMonth() +1
	let date = now.getDate()
	if(date < 10) date = '0' + date;
	if(month < 10) month = '0' + month;
	let today = month + '/' + date + '/' + year;
	$("#atFm").val(today)
	$("#atTo").val(today)
	
	ajaxGetOrders();
}

let appendCters = function() {
	let str = '';
	str += '<option class="cter_class" value="-1">'
		str += '全部客户';
	str += '</option>'
	str += '<option class="cter_class" value="0">'
		str += '散客';
	str += '</option>'
	for(let i=0; i<cters.length; i++) {
		let cter = cters[i];
		str += '<option class="cter_class" value='+cter._id+'>'
			str += cter.nome;
		str += '</option>'
	}
	$(".cter_class").remove();
	$("#cterId").append(str);
}

/* ============ 显示订单列表 ============ */
let bsOrdersShow = function() {
	let str = '<div class="bsOrders_class">'
	let tot = 0;
	for(let i=0; i<selOrds.length; i++) {
		let order = selOrds[i];
		if(!isNaN(order.imp)){
			tot += order.imp;
		}
	}
	str += '<h4 class="row text-right">'
		str += '<div class="col-6">'
			str += '<span class="text-warning">'
			str += selOrds.length
			str += '</span>'
			str += '<span> 单</span>'
		str += '</div>'
		str += '<div class="col-6">'
			str += '<span class="text-warning">'
			str += tot.toFixed(2)
			str += '</span>'
			str += '<span> €</span>'
		str += '</div>'
	str += '</h4>'
	for(let i=0; i<selOrds.length; i++) {
		let order = selOrds[i];
		str += '<div class="card bg-light mt-2 p-2">';
			str += '<div class="row orderCard" id="orderCard-'+order._id+'">';
				str += '<div class="col-12">';
					let code = 'view';
					if(order.code) code = order.code;
					let textSts = 'text-warning';
					if(order.status == 10) {
						textSts = 'text-danger'
					} else if(order.status == 0) {
						textSts = 'text-dark'
					}
					str += '<h4 class="'+textSts+'">'+code+'</h4>';
				str += '</div>';

				str += '<div class="col-6 text-left">';
				if(order.cter) {
					str += order.cter.nome;
				} else {
					str += '散客'
				}
				str += '</div>';
				str += '<div class="col-6 text-right">';
					str += '<span class="text-info">';
						if(isNaN(order.imp)){
							str += 'NaN';
						} else {
							str += Math.round(order.imp*100)/100
						}
					str += '</span>';
					str += '<span> €</span>'
				str += '</div>';

				if(order.note) {
					str += '<div class="col-12 text-warning text-left">';
						str += order.note;
					str += '</div>';
				}
			str += '</div>';

			str += '<div class="row multyDel" style="display:none">';
				str += '<div class="col-12 text-right">';
					str += '<button class="delAjax btn btn-danger" data-id='+order._id
					str += ' type="button">Del</button>';
				str += '</div>';
			str += '</div>';
		str += '</div>';
	}
	str += '</div>'
	$(".page").hide();
	$("#bsOrders_page").show();

	$(".bsOrders_class").remove();
	$("#bsOrders_page_elem").append(str);
}
$(function() {
	$(".datepicker").datepicker();
	init();

	/* ============= 显示订单筛选 ============= */
	$("#ordersFilter_showBtn").click(function(e){
		$(".ordersFilter").toggle();
	});
	$("#ordersFilter_hideBtn").click(function(e){
		$(".ordersFilter").hide();
	});

	/* ============= 时间筛选 ============= */
	$("#atFm").change(function(e) {
		let atFm = $("#atFm").val();
		$("#atTo").val(atFm);
		ajaxGetOrders();
	})
	$("#atTo").change(function(e) {
		let atFm = $("#atFm").val();
		let atTo = $("#atTo").val();
		if(!atFm) {
			$("#atFm").val(atTo);
			atFm = atTo;
		}
		ajaxGetOrders();
	})

	/* ============= 订单筛选 ============= */
	$(".selectOrd").change(function(e) {
		let status = $("#orderSts").val();
		let userId = $("#userId").val();
		let cterId = $("#cterId").val();
		selOrds = orders;

		let tempOrds = JSON.parse(JSON.stringify(selOrds));
		/* ============= 状态选择 ============= */
		if(status != -1) {
			selOrds = new Array();
			for(let i=0; i<tempOrds.length; i++) {
				if(tempOrds[i].status == status) {
					selOrds.push(tempOrds[i])
				}
			}
		}

		tempOrds = JSON.parse(JSON.stringify(selOrds));
		/* ============= 员工选择 ============= */
		if(userId != -1) {
			selOrds = new Array();
			for(let i=0; i<tempOrds.length; i++) {
				if(tempOrds[i].creater == userId) {
					selOrds.push(tempOrds[i])
				}
			}
		}

		tempOrds = JSON.parse(JSON.stringify(selOrds));
		/* ============= 客户选择 ============= */
		if(cterId != -1) {
			selOrds = new Array();
			if(cterId == 0) {
				for(let i=0; i<tempOrds.length; i++) {
					if(tempOrds[i].cter == null) {
						selOrds.push(tempOrds[i])
					}
				}
			} else {
				for(let i=0; i<tempOrds.length; i++) {
					if(tempOrds[i].cter && tempOrds[i].cter._id == cterId) {
						selOrds.push(tempOrds[i])
					}
				}
			}
		}

		bsOrdersShow();
	})

})