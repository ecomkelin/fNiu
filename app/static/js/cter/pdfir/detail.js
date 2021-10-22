$(function() {
	var totQuotFunc = function() {
		let quot = 0;
		$(".iptsty").each(function(index,elem) {
			let tquot = parseInt($(this).val());
			if(!isNaN(tquot)) {
				quot += tquot;
			}
		})
		$("#quotSapn").text(quot)
		$("#quotIpt").val(quot)
		$("#quotIpt").val(quot)
		let price = parseFloat($("#priceIpt").val());
		$("#impIpt").val(price*quot);
	}
	totQuotFunc();

	$(".iptsty").focus(function(e) {
		let val = $(this).val();
		if(val == 0) {
			$(this).val('')
		}
	})
	$(".iptsty").blur(function(e) {
		let val = $(this).val();
		if(!val || val.length == 0) {
			$(this).val(0)
		}
		
		totQuotFunc();
	})

	$("#cartFormSub").click(function(e) {
		let form = $("#cartForm");
		let data = form.serialize();
		$.ajax({
			type: "POST",
			url: '/ctOrcpdNewAjax',
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

	$(".smlImg").click(function(e) {
		$(".container").hide();
		$(".bigImg").show();
	})
	$(".bigImg").click(function(e) {
		$(".bigImg").hide();
		$(".container").show();
	})
})