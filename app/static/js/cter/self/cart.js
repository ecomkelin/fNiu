$(function() {
	/* ========== 显示商品更多信息 ========== */
	$(".trColorShow").click(function(e) {
		let target = $(e.target);
		let orcpdId = target.data('orcpd');

		$(".trColorShow").hide();
		$(".trColor-"+orcpdId).show();
	})

	/* ========== 更改购物车中商品数值 ========== */
	$(".quotIpt").blur(function(e) {
		let quot = parseInt($(this).val())
		let target = $(e.target);
		let orcpdId = target.data('id')
		let colorcode = target.data('color')
		let size = target.data('size')

		$.ajax({
			type: "GET",
			url: '/ctOrcpdUpdAjax?orcpdId='+orcpdId+'&colorcode='+colorcode+'&size='+size+'&quot='+quot,
			success: function(results) {
				if(results.success === 1) {
					let imp = results.imp;
					let orcpd = results.orcpd;
					$("#impSpan").text(imp)
					$("#quotSpan-"+orcpdId).text(orcpd.quot)
					$("#totSpan-"+orcpdId).text((orcpd.price*orcpd.quot).toFixed(2))
				} else if(results.success === 0) {
					alert(results.info);
				}
			}
		});
	})
	/* ========== 删除购物车中的商品 ========== */
	$(".orcpdDel").click(function(e) {
		let target = $(e.target);
		let orcpdId = target.data('id');
		$.ajax({
			type: "GET",
			url: '/ctOrcpdDelAjax?orcpdId='+orcpdId,
			success: function(results) {
				if(results.success === 1) {
					let imp = results.imp;
					$("#impSpan").text(imp)
					$("#orcpd-"+orcpdId).remove();
				} else if(results.success === 0) {
					alert(results.info);
				}
			}
		});
	})

	$("#orcSubBtn").click(function(e) {
		let target = $(e.target);
		let orcId = target.data('id');
		$.ajax({
			type: "GET",
			url: '/ctOrcSubAjax?orcId='+orcId,
			success: function(results) {
				if(results.success === 1) {
					location.reload();
				} else if(results.success === 0) {
					alert(results.info);
				}
			}
		});
	})
})