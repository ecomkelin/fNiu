$(function() {
	$(".changeStatus").click(function(e) {
		let target = $(e.target);
		let nomeId = target.data('id');
		let status = target.data('status');
		$.ajax({
			type: "GET",
			url: '/bsNomeChStsAjax?nomeId='+nomeId+'&status='+status,
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