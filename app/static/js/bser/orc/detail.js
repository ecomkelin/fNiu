$(function() {
	$("#orcSubBtn").click(function(e) {
		let target = $(e.target);
		let orcId = target.data('id');
		$.ajax({
			type: "GET",
			url: '/bsOrcSubAjax?orcId='+orcId,
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