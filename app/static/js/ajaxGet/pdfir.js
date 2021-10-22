var page = 0;
var count;
var isMore;
var pdfirsAll = new Array();
var getPdfirs = (urlQuery, elemId, isReload, role) => {
	// console.log(urlQuery)
	// console.log(elemId)
	// console.log(isReload)
	// console.log(role)

	$.ajax({
		type: "GET",
		url: urlQuery,
		success: function(results) {
			if(results.status === 1) {
				if(page+1 != results.data.page) {
					// 如果数据错误 则不输出
				} else {
					let pdfirs = results.data.pdfirs;
					for(let j=0; j<pdfirs.length; j++) {
						pdfirsAll.push(pdfirs[j])
					}
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#pdfirCount").text(count)
					pdfirsRender(pdfirs, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var pdfirsRender = (pdfirs, elemId, isReload, role) => {
	let elem = '<div class="row pdfirsElem">'
		for(let i=0; i<pdfirs.length; i++) {
			let pdfir = pdfirs[i];
			elem += pdfirRender(pdfir, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".pdfirsElem").remove();
	if(!elemId) elemId = "#pdfirsElem";
	$(elemId).append(elem);
}
var pdfirRender = (pdfir, role) => {
	let codeBg = 'bg-default';
	if(pdfir.shelf == 0) {
		codeBg = 'bg-secondary';
	} else if(pdfir.shelf == 2) {
		codeBg = 'bg-warning';
	}
	let pdfirDetail = '/'+role+'Pdfir/'+pdfir._id;
	if(role == 'ct') {
		pdfirDetail = '/product/'+pdfir._id;
		codeBg = 'bg-default';
	}

	let elem = '';
	elem += '<div class="col-6 col-lg-4 mt-2 text-center border-bottom border-left pdfirCard">'

		// elem += '<a href="'+pdfir.photo+'" target="_blank">'
		elem += '<img class="js-click-imgEnlarge" id="img-'+pdfir._id+'" src="'+pdfir.photo+'" '
			elem += 'width="100%" height="120px" '
			elem += 'style="object-fit: scale-down;"'
		elem += '/>'
		// elem += '</a>'
		// elem += '<img class="smlImg" id="img-'+pdfir._id+'" src="'+pdfir.photo+'" '
		// 	elem += 'width="100%" height="120px" '
		// 	elem += 'style="object-fit: scale-down;"'
		// elem += '/>'
		
		elem += '<div class="mt-3 '+codeBg+'">'
			elem += '<a class="text-primary '+codeBg+'" href='+pdfirDetail+'>'
				elem += '<div>'+pdfir.nome+'</div>'
				elem += '<div>'+pdfir.code+'</div>'
			elem += '</a>'
		elem += '</div>'
		if($("#crCter").val()) {
			let price = parseFloat(pdfir.price);
			if(!isNaN(price)) {
				price = price.toFixed(2) + ' €';
			} else {
				price = ''
			}
			elem += '<div class="text-info">'+price+'</div>'
		}
	elem += '</div>'
	return elem;
}