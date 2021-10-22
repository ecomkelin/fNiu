$(function() {
	$("#delBtn").click(function(e) {
		$(".delBtn").toggle();
	})

	$(".delBtn").click(function(e) {
		let target = $(e.target);
		let id = target.data('id');
		$.ajax({
		type: "GET",
		url: "/bsColorDelAjax?id="+id,
		success: function(results) {
			if(results.success === 1) {
				$("#colorBox-"+id).remove();
			} else if(results.success === 0) {
				alert(results.info);
			}
		}
	});
	})
})