$( function() {
	/* ============= 点击主页按钮, 隐藏其他页面, 显示首页 ============= */
	$(".orderTop").click(function(e) {
		$(".orderTop").removeClass('bg-success');
		$(this).addClass("bg-success");
	})

	/* === 点击导航栏 按钮 进入销售选择页面 === */
	$("#selectHome-topBtn").click(function(e) {
		$(".page").hide();
		$("#selOrderPage").show();
		
		headPdCode = '';
		/* 取消 筛选号码的显示 */
		$(".matchPds_class").remove();
		selOrds = new Array();

		selPdPage_appendElem();
	})
	/* === 点击导航栏 按钮 进入下单页面 === */
	$("#orderHome-topBtn").click(function(e) {
		$(".page").hide();
		$("#orderAddPage").show();

		ordfirsShow();
	})
	$("#selfHome-topBtn").click(function(e) {
		$(".page").hide();
		$("#bsSelf_page").show();

		selfInfoShow();
	})

	/* == 点击导航栏 按钮 显示订单列表页面 ==*/
	$("#ordersHome-topBtn").click(function(e) {
		$("#bsOrders_atFm").val('')
		$("#bsOrders_atTo").val('')
		$(".ordersFilter").hide();
		if(!isOrdersLoad) {
			ajaxGetOrders();
			isOrdersLoad = true;
		} else {
			bsOrdersShow(orders);
		}
	})
} );