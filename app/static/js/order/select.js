$( function() {
	/* ================ 输入框输入模特号码 模糊查找模特 ================ */
	$("#selOrderPage").on('input', '#headPdCode', function(e) {
		headPdCode = $(this).val().replace(/\s+/g,"").toUpperCase();
		selOrds = new Array();
		if(headPdCode.length > 0) {
			for (let i=0; i<pdfirs.length; i++) {
				let tmpOrd = new Object();
				tmpOrd.pdfir = pdfirs[i];
				tmpOrd.quot = 0;
				tmpOrd.price = pdfirs[i].price;
				if(pdfirs[i].code == headPdCode) {
					selOrds.unshift(tmpOrd)
				}
				else if ((pdfirs[i].code).split(headPdCode).length > 1) {
					selOrds.push(tmpOrd);
				}
			}
		}

		$("#selPdPage").hide();
		$("#matchPdsPage").show();
		matchPdsPage_appendElem();
	})

	/* ======== 焦点进入模特输入框 ======== */
	$("#headPdCode").focus(function(e) {
		$(this).val('');
		selOrds = new Array();
		$("#selPdPage").hide();
		headPdCode = '';
		$(".matchPds_class").remove();
		$("#matchPdsPage").show();
		matchPdsPage_appendElem();
	});

	/* ================ 点击筛选的selpd 只显示此selpd ================ */
	$("#matchPdsPage").on('click', '.selPdCard', function(e) {
		let pdfirId = $(this).attr('id').split('-')[1];
		selOrd = getOrdfirFromOrdfirs(pdfirId)
		if(!selOrd) {
			selOrd = getSelOrdFromSelOrds(pdfirId)
		}

		$("#matchPdsPage").hide();
		$("#selPdPage").show();

		selPdPage_appendElem();
	})

	/* ================ 添加新的产品 ================ */
	$("#selPdPage").on('click', '#newPdfir_submit', function(e) {
		let price = parseFloat($("#iptPdfirAddPrice").val());
		let cost = parseFloat($("#iptPdfirAddCost").val());
		let stock = parseInt($("#iptPdfirAddStock").val());
		if(isNaN(price)) {
			alert('请输入正确的产品价格')
		} else if(isNaN(cost)) {
			alert('请输入正确的产品成本')
		} else if(isNaN(stock)) {
			alert('库存输入错误')
		} else {
			let form = $("#newPdfir_Form");
			let data = form.serialize();
			$.ajax({
				type: "POST",
				url: '/ordAddPdfir',
				data: data,
				success: function(results) {
					if(results.success == 1) {

						/* === 把新产品添加到当前缓存 === */
						pdfir = results.pdfir;
						pdfirs.unshift(pdfir);

						/* === 把新产品作为被操作对象 === */
						selOrd = new Object();
						selOrd.pdfir = pdfir;
						selOrd.quot = 0;
						selOrd.price = pdfir.price;
						selOrds.unshift(selOrd)

						headPdCode = '';		// 防止再次出现新产品添加的情况
						selPdPage_appendElem();
					} else {
						alert(results.info);
					}
				}
			});
		}
	})

	/* =========== 焦点进入筛选的pd输入框 如果数值小于1 则消失 =========== */
	$("body").on('focus', '.quotIpt', function(e) {
		let quot = parseInt($(this).val());
		if(quot < 1) $(this).val('');
	})

	/* =========== 在筛选pd的列表中 点击增加减少按钮 =========== */
	$("body").on('click', '.quotBtn', function(e) {
		let target = $(e.target);
		let sym = parseInt(target.data('sym'));
		let pdfirId = target.data('id');

		let quot = parseInt($("#quotIpt_selPd-"+pdfirId).val());
		if(isNaN(quot)) {
			quot = parseInt($("#quotIpt_ordfir-"+pdfirId).val());
		}
		if(sym == 0) {
			quot = 0;
		} else {
			quot += sym;
		}
		optOrderChgfir(pdfirId, quot);
	})

	/* =========== 焦点从 筛选的pd输入框出来 订单发生相应变化 =========== */
	$("body").on('blur', '.quotIpt', function(e) {
		let pdfirId = $(this).attr("id").split('-')[1];
		// console.log(pdfirId)
		let quot = parseInt($(this).val());
		optOrderChgfir(pdfirId, quot);
	})

	/* =========== 在筛选的pd上点击价格 进行价格更改 =========== */
	$("#selPdPage").on('click', '.changePrice', function(e) {
		let pdfirId = $(this).attr("id").split("-")[1];
		$("#changeSelPrice-"+pdfirId).toggle();
	})
	/* =========== 从更改价格的输入框中出来 =========== */
	$("#selPdPage").on('blur', '.iptChangePrice', function(e) {
		let pdfirId = $(this).attr("id").split("-")[1];
		let newPrice = $(this).val();
		if(jsFunc_isFloat(newPrice)) {
			newPrice = parseFloat(newPrice);
			$("#selPriceSpan-"+pdfirId).text(newPrice)
			selOrd.price = newPrice;
			$("#changeSelPrice-"+pdfirId).hide();
		} else {
			alert('请输入正确的数字')
		}
	})

	/* =========== 重新加载数据 =========== */
	$(".reloadPdfirs").click(function(e) {
		window.location.href = "/order";
	})
});