let Conf = JSON.parse($("#Conf").val());
let headPdCode = '';
let schCterCode = '';

let pdfirs = new Array();
let cters = new Array();

let orders = new Array();
let isOrdersLoad = false;

/* == 加载产品 == */
let ajaxGetpdfirs = function() {
	$.ajax({
		type: "GET",
		url: '/getPdfirs',
		success: function(results) {
			if(results.success == 1) {
				pdfirs = results.pdfirs;	// 重新加载 pdfirs 数据
				$("#loading").hide();
				$("#loaded").show();
				$("#navIpt").show();
			} else {
				alert(results.info);
			}
		}
	});
}
ajaxGetpdfirs();

/* ===== 从后台获取客户列表 ===== */
let ajaxGetCters = function() {
	$.ajax({
		type: "GET",
		url: '/getCters',
		success: function(results) {
			if(results.success == 1) {
				cters = results.cters;	// 获取 cters 数据
				// bsCtersPage();			// 界面显示 cters
			} else {
				alert(results.info);
			}
		}
	});
}
ajaxGetCters();

/* ======== 从产品列表中找出 产品目标 ======== */
let getPdfirFromPdfirs = function(pdfirId) {
	let selPdfir = null;
	for (let i=0; i<pdfirs.length; i++) {
		if(pdfirs[i]._id == pdfirId) {
			selPdfir = pdfirs[i];
			break;
		}
	}
	return selPdfir;
}

/* ======== 从客户列表中找出 客户目标 ======== */
let getCterFromCters = function(cterId) {
	let selCter = null;
	for (let i = 0; i < cters.length; i++) {
		if(cters[i]._id == cterId) {
			selCter = cters[i];
			break;
		}
	}
	return selCter;
}