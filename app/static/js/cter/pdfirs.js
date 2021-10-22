let compare = function(property){
	return function(obj1,obj2){
		var value1 = obj1[property];
		var value2 = obj2[property];
		return value2 - value1;	// 升序
	}
}

$(function() {

	/* ============= 筛选方式 ============= */
	$("#sortToFind").click(function(e) {
		$("#sortSelect").hide();
		$("#pdCodeName").show();

		$("#sortToFind").hide();
		$("#findToSort").show();
	})
	$("#findToSort").click(function(e) {
		$("#pdCodeName").hide();
		$("#sortSelect").show();

		$("#findToSort").hide();
		$("#sortToFind").show();
	})
	/* ======================== 筛选 ======================== */
	$("body").on('input', '#pdCodeName', function(e) {
		let str = $(this).val().replace(/\s+/g,"").toUpperCase();
		selPdfirs = new Array();
		if(str.length > 0) {
			for (let i=0; i<pdfirs.length; i++) {
				pdfir = pdfirs[i];
				if(pdfir.code == str || pdfir.nome == str) {
					selPdfirs.unshift(pdfir)
				}
				else if ((pdfir.code).split(str).length > 1 || (pdfir.nome).split(str).length > 1) {
					selPdfirs.push(pdfir);
				}
			}
			pdfirsShow(selPdfirs)
		} else {
			pdfirsShow(pdfirs)
		}
	})

	/* ======================== 筛选 ======================== */
	$("#sortSelect").change(function(e) {
		let sort = $("#sortSelect").val().split('_');
		let sortBy = sort[0];
		let sortVal = parseInt(sort[1]);
		if(sortVal == -1) {
			pdfirsShow(pdfirs);
		} else if(sortVal == 1) {
			if(!pdSaleAll) {
				pdSaleAll = JSON.parse(JSON.stringify(pdfirs));
				pdSaleAll = pdSaleAll.sort(compare("sales"));
			}
			pdfirsShow(pdSaleAll);
		} else if(sortVal == 2) {
			if(!pdRcmds) {
				pdRcmds = new Array();
				for(let i=0; i<pdfirs.length; i++) {
					if(pdfirs[i].rcmd == 1) {
						pdRcmds.push(pdfirs[i]);
					}
				}
			}
			pdfirsShow(pdRcmds);
		} else if(sortVal == 3) {
			console.log('sales quater')
		} else if(sortVal == 4) {
			console.log('sales month')
		}
	})

	/* ======================== 查看 ======================== */
	$("#allPdfirs").on('click', '.selPdCard', function(e) {
		let pdfirId = $(this).attr("id").split('-')[1];
		pdfirShow(pdfirId)
	})

})