$(function() {
	$(".subBtn").click(function(e) {
		// let form = $("#bsProdUpdForm");
		// let data = form.serialize();
		// console.log(data)
		// return;
		$("#bsProdUpdForm").submit();
	})


	$("#crtImg").click(function(e) {
		$("#uploadPhoto").click();
	})
	$("#uploadPhoto").change(function(e) {
		var f = document.getElementById('uploadPhoto').files[0];
		var src = window.URL.createObjectURL(f);
		document.getElementById('crtImg').src = src;
		$("#crtImg").removeClass("rounded-circle")
	})
})