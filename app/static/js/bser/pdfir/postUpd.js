$(function() {
	$("#uploadPics").change(function(e) {
		$(".postsCrtBox").remove();
		const files = document.getElementById('uploadPics').files;
		let elem = ""
		for(let i=0; i<files.length; i++) {
			let src = window.URL.createObjectURL(files[i]);
			elem += '<div class="col-6 mt-3 postsCrtBox">'
				elem += '<img id="postsCrt-'+i+'" class="postsCrt" src='+src+ ' width="100%" height="100px" />'
			elem += '</div>'
		}
		// document.getElementById('crtImgs').src = src;
		$("#crtImgs").append(elem)
	})
})