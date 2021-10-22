$( function() {

	/* === 在销售页面点击 selCter-Btn 弹出或消失客户 === */
	$("#selCter-Btn").click(function(e) {
		if(!isOrderAddShowCters) {
			orderAdd_ShowCters(cters, true);
		} else {
			orderAdd_HideCters();
		}
	})
	/* ======================== 弹出的客户中输入客户名称选择客户 ======================== */
	$("#cterPage").on('input', '#searchCter', function(e) {
		schCterCode = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(schCterCode.length == 0) {
			orderAdd_ShowCters(cters, true);
		} else {
			let selCters = new Array();
			let isMatchCter = false;
			for (let i=0; i<cters.length; i++) {
				if(cters[i].nome == schCterCode) {
					isMatchCter = true;
					selCters.unshift(cters[i])
				}
				else if ((cters[i].nome).split(schCterCode).length > 1) {
					selCters.push(cters[i]);
				}
			}
			orderAdd_ShowCters(selCters, isMatchCter);
		}
	})

	/* ======================= 添加 客户 ======================= */
	$("#cterPage").on('click', '#newCterBtn', function(e) {
		addCterAjax()
	})
	
	/* ======================= 选择 客户 ======================= */
	$("#cterPage").on('click', '.selCterBtn', function(e) {
		let id = $(this).attr("id");
		let cterNome = id.split('-')[1]
		let cterId = id.split('-')[2]

		decideCter(cterId, cterNome)
	})

	/* ================ 取消选择 客户 ================ */
	$("#cnlCter").click(function(e) {
		decideCter('', '散客');
	})

	/* =============== 添加新的客户 =============== */
	$("#bsOrderAdd_cters").on('click', '#newCter_submit', function(e) {
		let vip = parseInt($("#iptBsCterAdVip").val());
		if(isNaN(vip)) {
			alert('vip只能是数字')
		} else {
			let form = $("#newCter_Form");
			let data = form.serialize();
			$.ajax({
				type: "POST",
				url: '/ordAddCter',
				data: data,
				success: function(results) {
					if(results.success == 1) {
						cter = results.cter;
						cters.unshift(cter);
						decideCter(cter._id, cter.nome)
					} else {
						alert(results.info);
					}
				}
			});
		}
	})


	/* =============== 提交订单 按钮 =============== */
	$("#bsOrderAdd_btnSub").click(function(e) {
		let form = $("#bsOrderAddForm");
		let data = form.serialize();
		$.ajax({
			type: "POST",
			url: '/orderNew',
			data: data,
			success: function(results) {
				if(results.success == 1) {
					let order = results.order;
					let isUpd = results.isUpd;
					ordfirs = new Array();
					selOrd = null;
					if(isUpd) {
						for(let i=0; i<orders.length; i++) {
							if(orders[i].code == order.code) {
								orders[i] = order;
							}
						}
					} else {
						orders.unshift(order);
					}
					decideCter('', '散客');
					$("#form_orderId").val('');
					$("#bsOrderAdd_arts").text(0)
					bsOrderShow(order)
				} else {
					alert(results.info);
				}
			}
		});
	})


});