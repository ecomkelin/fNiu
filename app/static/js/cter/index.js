/* ======== 显示选择的产品 ======== */
let appendPdfirs = function(selPdfirs) {
	let elem = '';
	for(let i=0; i<selPdfirs.length; i++) {
		if(i == 60) break;
		let selPd = selPdfirs[i];
		elem += '<div class="row p-2 mt-2 border bg-light selPdCard" id="selPdCard-'+selPd._id+'">'
			elem += '<div class="col-4">'
				elem += '<div class="row">'
					let textCode = '';
					if(selPd.rcmd ==1) {
						textCode = 'text-info';
					}
					elem += '<h4 class="col-12 '+textCode+'">'+ selPd.code+ '</h4>';
				elem += '</div>';
				elem += '<div class="row">'
					elem += '<img class="foto-showImg" src="' + selPd.photo +'" ';
					elem += 'width="100%" ';
					elem += 'style="max-width:100px;max-height:100px;"'
					elem += ' alt="'+selPd.code+'" />';
				elem += '</div>';
			elem += '</div>';

			elem += '<div class="col-8">'
				elem += '<div class="row">'
					elem += '<h5 class="col-12">'+ selPd.nome+ '</h5>';
				elem += '</div>';
				// elem += '<div class="row mt-1">'
				// 	elem += '<div class="col-6">库存: ' + selPd.stock + '</div>';
				// 	elem += '<div class="col-6 text-right">销量: ' + selPd.sales + '</div>';
				// 	// elem += '<div class="col-6 text-warning"> 原价:'+ selPd.price + ' €</div>';
				// elem += '</div>';

				elem += '<div class="row mt-2">'
					elem += '<h5 class="col-12 pt-2">价格: '
							elem += selPd.price 
					elem += ' €</h5>'
				elem += '</div>';
			elem += '</div>';

		elem += '</div>';
	}
	return elem;
}
let pdfirsShow = function(selPdfirs) {
	let elem = '<div class="allPdfirs_class">'
	
	elem += appendPdfirs(selPdfirs)
	elem += '</div>';
	
	$(".allPdfirs_class").remove();
	$("#allPdfirs").append(elem);
}


let pdfirShow = function(pdfirId) {
	let pdfir = getPdfirFromPdfirs(pdfirId);
	let elem = '<div class="pdfir_class p-3">';

	elem += '<div class="row mt-3">'
		elem += '<div class="col-12">'
			elem += '<button class="btn btn-info backPdfirs" type="button"> 返回 </button>'
		elem += '</div>'
	elem += '</div>'
	elem += '<table class="table table-bordered my-3">';
		elem += '<tr>'
			elem += '<td> 编号 </td>'
			elem += '<td>' + pdfir.code + '</td>'
		elem += '</tr>'
		elem += '<tr>'
			elem += '<td> 名称 </td>'
			elem += '<td>' + pdfir.nome + '</td>'
		elem += '</tr>'
		elem += '<tr>'
			elem += '<td> 价格 </td>'
			elem += '<td>' + pdfir.price + '</td>'
		elem += '</tr>'
		// elem += '<tr>'
		// 	elem += '<td> 销量 </td>'
		// 	elem += '<td>' + pdfir.sales + '</td>'
		// elem += '</tr>'
	elem += '</table>'
	elem += '<div class="row mt-5">'
		elem += '<div class="col-12" align="center">'
			elem += '<img src='+pdfir.photo+' width="100%">'
		elem += '</div>'
	elem += '</div>'

	elem += '</div>'
	$(".pdfir_class").remove();
	$("#pdfirInfo").append(elem);
	$(".page").hide();
	$("#pdfir_page").show();
}