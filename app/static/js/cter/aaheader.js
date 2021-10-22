$(function() {
	/* ====== 导航栏效果 =====*/
	$(".navb").mouseover(function(e) {
		let id = $(this).attr("id")
		$(".topNav-second-header").hide();
		$(".topNav-second-headerHide").show();
		$("."+id).show();
	})
	$(".topNav-second-headerHide").mouseover(function(e) {
		$(".topNav-second-header").hide();
		$(".topNav-second-headerHide").hide();
	})


	/* ================== 搜索 ======================== */
	let pdfirs;
	let pdsecs;

	/* ================== 跳转 ======================== */
	$("#headSearch").change(function(e) {
		let str = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		let arr = str.split(" [-")
		let secCode = '';
		let firCode = '';
		if(arr) {
			let pdfirId;
			if(arr.length == 1) {
				firCode = arr[0].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
				for(let i=0; i<pdfirs.length; i++) {
					let pdfir = pdfirs[i];
					if(pdfir.code == firCode) {
						pdfirId = pdfir._id;
						break;
					}
				}
			} else {
				secCode = arr[0].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
				firCode = arr[1].replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
				firCode = firCode.split(" -]")[0]
				for(let i=0; i<pdsecs.length; i++) {
					let pdsec = pdsecs[i];
					if(pdsec.code == secCode && pdsec.pdfir.code == firCode) {
						pdfirId = pdsec.pdfir._id;
						break;
					}
				}
			}
			if(pdfirId) {
				location.href = "/ctPdfir/"+pdfirId;
			}
		}
	})
	$(".headSearch").on('input', '#headSearch', function(e) {
		let str = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		$.ajax({
			type: "GET",
			url: '/usGetdataAjax?keyword='+str,
			success: function(results) {
				if(results.status === 1) {
					dataRender(results.data);
					
				} else if(results.status === 0) {
					alert(results.msg);
				}
			}
		});
	})
	var dataRender = (data) => {
		pdfirs = data.pdfirs;
		firCount = data.firCount;
		firIsMore = data.firIsMore;

		pdsecs = data.pdsecs;
		secCount = data.secCount;
		secIsMore = data.secIsMore;
		// console.log(data)
		$(".searchElem").remove();
		let elem = '';
		// elem += '<option class="searchElem" value="-------------- Serie --------------">'
		for(let i=0; i<pdfirs.length; i++) {
			let pdfir = pdfirs[i];
			elem += '<option class="searchElem" value="'+pdfir.code+'">'
		}
		// elem += '<option class="searchElem" value="------------ Product ------------">'
		for(let i=0; i<pdsecs.length; i++) {
			let pdsec = pdsecs[i];
			elem += '<option class="searchElem" id="fir-'+pdsec.pdfir._id+'-sec-'+pdsec._id+'" '
			elem += 'value="'+pdsec.code+' [- '+pdsec.pdfir.code+' -]">'
		}
		$("#headSearchList").append(elem);
	}

	$("#headSearchBtn").click(function(e) {
		let str = $("#headSearch").val();
		console.log(str)
	})
})