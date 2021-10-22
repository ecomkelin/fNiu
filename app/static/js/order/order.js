$( function() {
	/* ======== 在 订单列表页面 点击订单 进入订单页面 ======== */
	$("#bsOrders_page").on('click', '.bsOrders_orderCard', function(e) {
		let orderId = $(this).attr('id').split('-')[1];
		let order = getOrderFromOrders(orderId);
		bsOrderShow(order)
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



	/* ======== 在 订单详情页面 点击删除按钮 删除订单 ======== */
	$("#bsOrder_page").on('click', '.bsOrder_delBtn', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');
		$.ajax({
			type: "GET",
			url: '/orderDelSts?orderId='+orderId,
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


	/* ======== 在 订单详情页面 点击复制按钮 复制订单 ======== */
	$("#bsOrder_page").on('click', '.bsOrder_copyOrder', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');
		optOrder(orderId, 'copy')
	})
	var optOrder = function(orderId, opt) {
		$.ajax({
			type: "GET",
			url: '/getOrderAjax?orderId='+orderId,
			success: function(results) {
				if(results.success == 1) {
					order = results.order;
					ordfirs = order.ordfirs;
					let i=0;
					for(; i<ordfirs.length; i++) {
						if(!ordfirs[i].pdfir) break;
					}
					if(i != ordfirs.length) {
						if(opt == 'upd') {
							alert("订单中有被删除的模特, 不可更新")
						} else {
							alert("订单中有被删除的模特, 不可复制")
						}
					} else {
						$(".page").hide();
						$("#orderAddPage").show();
						$("#headUserInfo").hide();
						$("#headPdFilter").show();
						$("#headPdCode").focus();

						$(".orderTop").removeClass('bg-success');
						$("#orderHome-topBtn").addClass("bg-success");

						if(order.cter){
							decideCter(order.cter._id, order.cter.nome)
						} else {
							decideCter('', '散客');
						}
						if(opt == 'upd') {
							$("#form_orderId").val(order._id)
						}
						ordfirsShow();
					}
				} else {
					alert(results.info);
				}
			}
		});
	}
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}
	let orderInit = function() {
		let opt = getUrlParam('opt');
		let orderId = getUrlParam('orderId');
		if(opt && orderId) {
			optOrder(orderId, opt)
		}
	}
	orderInit()

	
	/* ======== 在 订单详情页面 点击更新按钮 更新订单 ======== */
	$("#bsOrder_page").on('click', '.bsOrder_upOrder', function(e) {
		let target = $(e.target);
		let orderId = target.data('id');
		
		optOrder(orderId, 'upd')
	})

	/* ======== 在 订单详情页面 点击小票打印 ======== */
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
});