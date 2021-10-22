$(function() {
	$(".js-scroll-DwHideUpShow").hide();
	$(".navBtn").click(function(e) {
		let id = $(this).attr('id');

		$(".navPage").hide();
		$("."+id).show();

		$(".navBtn").removeClass("btn-info")
		$(".navBtn").addClass("btn-default")
		$(this).removeClass("btn-default")
		$(this).addClass("btn-info")
	})	
})