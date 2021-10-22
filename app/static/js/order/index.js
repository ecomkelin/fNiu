let selPdNum = 10;
let selOrds = new Array();
let selOrd = null;
let ordfirs = new Array();
let isOrderAddShowCters = false;

/* ======== 从订单列表中找出 订单 ======== */
let getOrderFromOrders = function(orderId) {
	let order = null;
	for(let i = 0; i<orders.length; i++){
		if(orders[i]._id == orderId) {
			order = orders[i];
			break;
		}
	}
	return order;
}

/* ======== 从订单中的产品列表中找出 产品目标 ======== */
let getOrdfirFromOrdfirs = function(pdfirId) {
	let ordfir = null;
	for(let i = 0; i<ordfirs.length; i++){
		if(ordfirs[i].pdfir._id == pdfirId) {
			ordfir = ordfirs[i];
			break;
		}
	}
	return ordfir;
}

/* ======== 从模糊匹配的产品列表中找出 相应的产品 ======== */
let getSelOrdFromSelOrds = function(pdfirId) {
	let slectOrd = null;
	for(let i = 0; i<selOrds.length; i++){
		if(selOrds[i].pdfir._id == pdfirId) {
			slectOrd = selOrds[i];
			break;
		}
	}
	return slectOrd;
}





/* ======== 前端添加匹配的产品 ======== */
let matchPdsPage_appendElem = function() {
	let elem = '<div class="matchPds_class">'
	if(headPdCode && headPdCode.length > 1) {
		elem += '<div class="row my-3 text-center">'
		if(selOrds && selOrds.length > 0) {
			/* ============ 判断是否有此产品 ============ */
			if(selOrds[0].pdfir.code != headPdCode) {
				elem += '<div class="col-12 p-2 text-center bg-warning selPdCard" '
				elem += 'id="newPdfir-">'
					elem += '<span class="oi oi-plus"></span>'
				elem += '</div>'
			}
		} else {
			elem += '<div class="col-12 p-2 text-center bg-warning selPdCard" '
			elem += 'id="newPdfir-">'
				elem += '<span class="oi oi-plus"></span>'
			elem += '</div>'
		}
		elem += '</div>'
	}
	for(let i=0; i<selOrds.length; i++) {
		if(i == selPdNum) break;
		let selPd = selOrds[i].pdfir;
		elem += '<div class="row p-2 m-1 border bg-light selPdCard" id="selPdCard-'+selPd._id+'">'
			elem += '<div class="col-4">'
				elem += '<div class="row">'
					elem += '<img class="foto-showImg" src="' + selPd.photo +'" ';
					elem += 'width="100%" ';
					elem += 'style="max-width:100px;max-height:100px;"'
					elem += ' alt="'+selPd.code+'" />';
				elem += '</div>';
			elem += '</div>';

			elem += '<div class="col-8">'
				elem += '<div class="row">'
					elem += '<h4 class="col-6">'+ selPd.code+ '</h4>';
					elem += '<h5 class="col-6 text-right">'+ selPd.nome+ '</h5>';
				elem += '</div>';
				elem += '<div class="row mt-1">'
					elem += '<div class="col-6">库存: ' + selPd.stock + '</div>';
					elem += '<div class="col-6 text-right">销量: ' + selPd.sales + '</div>';
					// elem += '<div class="col-6 text-warning"> 原价:'+ selPd.price + ' €</div>';
				elem += '</div>';

				// console.log(selOrd)
				elem += '<div class="row mt-2">'
					elem += '<h5 class="col-6 pt-2">'
							elem += selPd.price 
					elem += ' €</h5>'
				elem += '</div>';
			elem += '</div>';

		elem += '</div>';
	}
	elem += '</div>';
	
	$(".matchPds_class").remove();
	$("#matchPdsPage").append(elem);
}

/* ======== 前端添加正在操作的产品 ======== */
let selPdPage_appendElem = function() {
	let elem = '<div class="selPd_class">'
	if(selOrd) {
		let selPd = selOrd.pdfir;

		elem += '<div class="row p-2 m-1 border" >'
			elem += '<div class="col-4">'
				elem += '<div class="row">'
					elem += '<img class="foto-showImg" src="' + selPd.photo +'" ';
					elem += 'width="100%" ';
					elem += 'style="max-width:100px;max-height:100px;"'
					elem += ' alt="'+selPd.code+'" />';
				elem += '</div>';
			elem += '</div>';

			elem += '<div class="col-8">'
				elem += '<div class="row">'
					elem += '<h4 class="col-6">'+ selPd.code+ '</h4>';
					elem += '<h5 class="col-6 text-right">'+ selPd.nome+ '</h5>';
				elem += '</div>';
				elem += '<div class="row mt-1">'
					elem += '<div class="col-6">库存: ' + selPd.stock + '</div>';
					elem += '<div class="col-6 text-right">销量: ' + selPd.sales + '</div>';
					// elem += '<div class="col-6 text-warning"> 原价:'+ selPd.price + ' €</div>';
				elem += '</div>';

				// console.log(selOrd)
				elem += '<div class="row mt-2">'
					elem += '<h5 class="col-6 text-info pt-2 changePrice" id="selPrice-'+selOrd.pdfir._id+'">'
						elem += '<span id="selPriceSpan-'+selOrd.pdfir._id+'">'
							elem += selOrd.price 
						elem += '</span> <span> €</span>'
					elem += '</h5>'
					// if(selPd.price != selOrd.price) {
					// 	elem += '<div class="col-6 text-secondary pt-2">原价: '+ selPd.price + ' €</div>';
					// }
					elem += '<div class="col-6" id="changeSelPrice-'
					elem += selOrd.pdfir._id+'" style="display:none">'
						elem += '<input class="form-control iptChangePrice" id="selIptPric-'
						elem += selOrd.pdfir._id+'" type="text" value='+selOrd.price+'>'
					elem += '</div>';
				elem += '</div>';

				elem += '<div class="row mt-2">'
					// elem += '<div class="col-2 text-right">'
					// 	elem += '<button type="button" class="btn btn-warning btn-lg quotBtn" ';
					// 	elem += 'data-sym=-1 data-id='+selPd._id+'> - </button>';
					// elem += '</div>';
					// elem += '<div class="col-4">'
					// 	elem += '<input type="number" id="quotIpt_selPd-'+selPd._id;
					// 	elem += '" class="ipt-50-35 quotIpt" value='+selOrd.quot+'>'
					// elem += '</div>';
					// elem += '<div class="col-2">'
					// 	elem += '<button type="button" class="btn btn-primary btn-lg quotBtn" ';
					// 	elem += 'data-sym=1 data-id='+selPd._id+'> + </button>';
					// elem += '</div>';

					elem += '<div class="col-4">'
						elem += '<button type="button" class="btn btn-link text-danger quotBtn" ';
						elem += 'data-sym=0 data-id='+selPd._id+'> 清除 </button>';
					elem += '</div>';
					elem += '<button type="button" class="col-2 btn btn-warning quotBtn" ';
					elem += 'data-sym=-1 data-id='+selPd._id+'> - </button>';

					elem += '<input type="number" id="quotIpt_ordfir-'+selPd._id;
					elem += '" class="col-4 form-control quotIpt" value='+selOrd.quot+'>'

					elem += '<button type="button" class="col-2 btn btn-primary quotBtn" ';
					elem += 'data-sym=1 data-id='+selPd._id+'> + </button>';
				elem += '</div>';
			elem += '</div>';

		elem += '</div>';
	} else if(headPdCode && headPdCode.length > 1) {
		/* ============================ 添加新模特页面  ============================ */
		// console.log(headPdCode)
		elem += '<form id="newPdfir_Form" class="newPdfir_Form p-2">'
			elem += '<div class="form-group row mt-4">'
				elem += '<label class="col-4 col-form-label for="iptPdfirAddCode">编号</label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptPdfirAddCode" class="form-control" type="text" '
					elem += 'name="obj[code]", readonly="readonly", value='+headPdCode+'>'
				elem += '</div>'
				elem += '<div class="col-4"></div>'
				elem += '<div class="col-8 text-danger>'
					elem += '<span id="optPdfirUpCode"></span>'
				elem += '</div>'
			elem += '</div>'
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label for="iptPdfirAddPrice">售价</label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptPdfirAddPrice" class="form-control" type="number" '
					elem += 'name="obj[price]", autocomplete="off" placeholder="必填">'
				elem += '</div>'
				elem += '<div class="col-4"></div>'
				elem += '<div class="col-8 text-danger>'
					elem += '<span id="optPdfirUpPrice"></span>'
				elem += '</div>'
			elem += '</div>'
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label for="iptPdfirAddNome">名称</label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptPdfirAddNome" class="form-control" type="text" '
					elem += 'name="obj[nome]", autocomplete="off">'
				elem += '</div>'
				elem += '<div class="col-4"></div>'
				elem += '<div class="col-8 text-danger>'
					elem += '<span id="optPdfirUpNome"></span>'
				elem += '</div>'
			elem += '</div>'
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label for="iptPdfirAddCost">采购价</label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptPdfirAddCost" class="form-control" type="number" '
					elem += 'name="obj[cost]", autocomplete="off", value=0>'
				elem += '</div>'
				elem += '<div class="col-4"></div>'
				elem += '<div class="col-8 text-danger>'
					elem += '<span id="optPdfirUpPriceIn"></span>'
				elem += '</div>'
			elem += '</div>'
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label for="iptPdfirAddStock">库存</label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptPdfirAddStock" class="form-control" type="number" '
					elem += 'name="obj[stock]", autocomplete="off", value=0>'
				elem += '</div>'
				elem += '<div class="col-4"></div>'
				elem += '<div class="col-8 text-danger>'
					elem += '<span id="optPdfirUpStock"></span>'
				elem += '</div>'
			elem += '</div>'

			elem += '<div class="form-group row">'
				elem += '<div class="col-8"></div>'
				elem += '<div class="col-4">'
					elem += '<button id="newPdfir_submit" class="btn btn-info btn-block" '
					elem += 'type="button"> 添加 </button>'
				elem += '</div>'
			elem += '</div>'
		elem += '</form>'
	}
	elem += '</div>'
	$("#headPdCode").val("")
	$("#headPdNum").text(getPz())
	$(".selPd_class").remove();
	$("#selPdPage").append(elem);
}
let getPz = function() {
	let pz = 0;
	for(let i=0; i<ordfirs.length; i++) {
		pz += ordfirs[i].quot;
	}
	return pz;
}
/* ========== 订单中的产品 ========== */
let ordfirsShow = function() {
	let elem = '<div class="ordfirsShow_class">'
	let piece = 0, imp = 0, real=0;

	for(let i=0; i<ordfirs.length; i++) {
		let ordfir = ordfirs[i];
		let pdfir = ordfir.pdfir;

		piece += ordfir.quot;
		imp += ordfir.quot*ordfir.price;
		real += ordfir.quot*pdfir.price;

		elem += '<div class="row p-2 m-1" style="background: #C0C0C0">'
			elem += '<div class="col-3">'
				elem += '<div class="row">'; 		// 照片
					elem += '<img class="foto-showImg" src="' + pdfir.photo +'" ';
					elem += 'width="100%" ';
					elem += 'style="max-width:100px;max-height:100px;"'
					elem += ' alt="'+pdfir.code+'" />';
				elem += '</div>';
			elem += '</div>';

			elem += '<div class="col-9">'
				elem += '<div class="row">'
					elem += '<h4 class="col-6">'+ pdfir.code+ '</h4>';
					elem += '<h5 class="col-6 text-right">'+ pdfir.nome+ '</h5>';
				elem += '</div>';

				elem += '<div class="row mt-1">'
					elem += '<div class="col-6">单价:'+ ordfir.price + ' €</div>';
					elem += '<input type="hidden" name="obj[firs]['+i+'][price]" value='
					elem += ordfir.price + '>'
					elem += '<div class="col-6 text-right">总价: ';
						elem += Math.round(ordfir.quot*ordfir.price * 100) / 100 + ' €';
					elem += '</div>';
				elem += '</div>';

				elem += '<div class="row mt-2">'
					elem += '<div class="col-4">'
						elem += '<button type="button" class="btn btn-link text-danger quotBtn" ';
						elem += 'data-sym=0 data-id='+pdfir._id+'> 清除 </button>';
					elem += '</div>';
					elem += '<input type="hidden" name="obj[firs]['+i+'][pdfir]" value='
					elem += pdfir._id + '>'
					elem += '<input type="hidden" name="obj[firs]['+i+'][quot]" value='
					elem += ordfir.quot + '>'
					elem += '<button type="button" class="col-2 btn btn-warning quotBtn" ';
					elem += 'data-sym=-1 data-id='+pdfir._id+'> - </button>';

					elem += '<input type="number" id="quotIpt_ordfir-'+pdfir._id;
					elem += '" class="col-4 form-control quotIpt" value='+ordfir.quot+'>'

					elem += '<button type="button" class="col-2 btn btn-primary quotBtn" ';
					elem += 'data-sym=1 data-id='+pdfir._id+'> + </button>';
				elem += '</div>';
			elem += '</div>';
		elem += '</div>';
	}
	elem += '</div>'

	$(".ordfirsShow_class").remove();
	$("#ordfirsShow").append(elem);

	$("#cterPage").hide();
	$("#ordfirsShow").show();

	$("#bsOrderAdd_pz").text(getPz())
	$("#bsOrderAdd_arts").text(ordfirs.length)
	$("#bsOrderAdd_real").val(Math.round(real * 100) / 100 )
	$("#bsOrderAdd_pdPr").val(Math.round(imp * 100) / 100 )
	$("#bsOrderAdd_imp").val(Math.round(imp * 100) / 100 )
}

/* =========== 操作订单时, 订单相应的产品显示更新 =========== */
let optOrderChgfir = function(pdfirId, quot) {
	let ordfir = getOrdfirFromOrdfirs(pdfirId);
	// console.log(ordfir)
	if(!ordfir) {
		ordfir = selOrd;
	}
	// console.log(ordfir)

	let pdfir = ordfir.pdfir;
	let orgQuot = ordfir.quot;

	if(isNaN(quot) || quot < 0) {
		quot = 0;
	}
	$("#quotIpt_selPd-"+pdfirId).val(quot);
	if(quot != orgQuot) {
		ordfir.quot = quot;
		// 添加
		if(orgQuot == 0) {
			ordfirs.unshift(ordfir)
			// console.log(ordfirs)
		} 
		// 删除
		else if(quot == 0) {
			let newFirs = new Array();
			for(let i=0; i<ordfirs.length; i++) {
				if(ordfirs[i].pdfir._id == pdfir._id) {
					continue;
				}
				newFirs.push(ordfirs[i])
			}
			ordfirs = newFirs;
			// console.log(ordfirs)
		}
		// 更改
		else {
			// console.log(ordfirs)
		}
		// $("#headPdNum").text(getPz())
		ordfirsShow()
		selPdPage_appendElem()
	}
}























/* ============== 显示订单详细信息 ============== */
let bsOrderShow = function(order) {
	let elem = '<div class="bsOrder_class">'
		elem += '<div style="height:50px"></div>'
		/* ---------- 客户 订单号 显示操作按钮 --------- */
		elem += '<div class="row">';
			elem += '<h4 class="col-4 p-2">'
				// console.log(order)
				if(order.cter){
					elem += order.cter.nome
				}
				else{
					elem += '散客'
				}
			elem += '</h4>'
			elem += '<div class="col-8 text-right bsOrder_optionShow">'
				elem += '<h4 class="text-info">'
					elem += order.code+' &nbsp; <span class="oi oi-chevron-bottom"></span>'
				elem += '</h4>';
			elem += '</div>'
			elem += '<div class="col-8 text-right bsOrder_optionHide" style="display:none">'
				elem += '<h4 class="text-info">'
					elem += order.code+' &nbsp; <span class="oi oi-chevron-top"></span>'
				elem += '</h4>';
			elem += '</div>'
		elem += '</div>'
		/* ------------------------------ 显示操作空间 ----------------------------- */
		elem += '<div class="row bsOrder_optionPage mt-3" style="display:none">';
			elem += '<div class="col-4">'
				elem += '<button class="btn btn-danger bsOrder_delBtn" '
				elem += 'data-id='+order._id+' type="button"> 删除 </button>'
			elem += '</div>'
			elem += '<div class="col-4">'
				elem += '<button class="btn btn-warning btn-block bsOrder_copyOrder" type="button" '
				elem += 'data-id='+order._id+'>复制 </button>'
			elem += '</div>'
			elem += '<div class="col-4">'
				elem += '<button class="btn btn-warning btn-block bsOrder_upOrder" type="button" '
				elem += 'data-id='+order._id+'> 更新</button>'
			elem += '</div>'
		elem += '</div>'
		
		/* ------------------ 产品基本信息 ------------------ */
		elem += '<table class="table table-borderless border border-dark mt-4">';
			elem += '<tr>'
				elem += '<th class="border border-dark"> Code </th>'
				elem += '<th class="border border-dark" colspan="2"> Desc </th>'
				elem += '<th class="border border-dark text-right"> QNT </th>'
				elem += '<th class="border border-dark text-right"> Prezzo </th>'
				elem += '<th class="border border-dark text-right"> Total(€) </th>'
			elem += '</tr>'
			let firLen = order.ordfirs.length;
			let pieces = 0;
			for(let i=0; i<firLen; i++) {
				let ordfir = order.ordfirs[i];
				pieces += ordfir.quot;
				elem += '<tr>'
					if(ordfir.pdfir) {
						let pdfir = ordfir.pdfir;
						elem += '<td>'+pdfir.code+'</td>';
						let pdname = pdfir.nome;
						if(pdname && pdname.length > 5){
							pdname = pdname.slice(0,3)+'...';
						}
						elem += '<td colspan="2">'+pdname+'</td>'
					} else {
						elem += '<td colspan="3">模特已删除</td>'
					}
					elem += '<td class="text-right">'+ordfir.quot+'</td>'
					elem += '<td class="text-right">'+Math.round(ordfir.price * 100)/100+'</td>'
					elem += '<td class="text-right">'+Math.round(ordfir.price*ordfir.quot * 100)/100+'</td>'
				elem += '</tr>'
			}
			elem += '<tr>'
				elem += '<th colspan="2" class="border border-dark"> TOT: '+firLen+'</th>'
				elem += '<th colspan="2" class="border border-dark text-right">'+pieces+' pz</th>'
				elem += '<th colspan="2" class="border border-dark text-right"> IMP: '+Math.round(order.pdPr * 100)/100+' €</th>'
			elem += '</tr>'
		elem += '</table>'

		elem += '<div class="row mt-4">'
			elem += '<div class="col-6">'
				elem += '原价: '+Math.round(order.real * 100)/100+' €'
			elem += '</div>'
			elem += '<div class="col-6 text-right">'
				elem += '实收: '+Math.round(order.imp * 100)/100+' €'
			elem += '</div>'
		elem += '</div>'
		if(order.note) {
			elem += '<div class="row mt-4">';
				elem += '<div class="col-12 bg-light">'
					elem += order.note
				elem += '</div>'
			elem += '</div>'
		}

		elem += '<div style="height:100px"></div>'
		for(let i=0; i<firLen; i++) {
			let ordfir = order.ordfirs[i];
			pieces += ordfir.quot;
			elem += '<div class="row mt-2 bg-light py-2">'
				let pdfir = new Object();
				pdfir.photo = '/1.jpg'
				pdfir.code = '模特已删除'
				if(ordfir.pdfir) {
					pdfir = ordfir.pdfir;
				}
				elem += '<div class="col-4">'
					elem += '<img src="' + pdfir.photo +'" width="100%" ';
					elem += 'style="max-width:100px;max-height:100px;"'
					elem += ' alt="'+pdfir.code+'" />';
				elem += '</div>'
				elem += '<div class="col-8">'
					elem += '<div class="row">'
						elem += '<h3 class="col-6">'+pdfir.code+'</h3>'
						elem += '<h4 class="col-6 text-right">'+pdfir.nome+'</h4>'
						elem += '<div class="col-12 text-right">'
							elem += ordfir.quot+'pz * '
							elem += Math.round(ordfir.price * 100)/100+'€ = &nbsp; &nbsp;'
							elem += Math.round(ordfir.price*ordfir.quot * 100)/100+'€'
						elem += '</div>'
					elem += '</div>'
				elem += '</div>'
			elem += '</div>'
		}
		elem += '<div style="height:100px"></div>'

		elem += '<div class="topNav-second pt-2">'
			elem += '<div class="row p-2">';
				elem += '<div class="col-6">'
					elem += '<button class="btn btn-link btn-block printStamp" type="button" '
					elem += 'data-id='+order._id+'>打印 <span class="oi oi-print"></span></button>'
				elem += '</div>'
				elem += '<div class="col-6">'
					elem += '<button class="btn btn-link btn-block printTicket" type="button" '
					elem += 'data-id='+order._id+'>小票 <span class="oi oi-print"></span></button>'
				elem += '</div>'
			elem += '</div>'
		elem += '</div>'

	elem += '</div>'

	$(".orderTop").removeClass('bg-success');
	$(".page").hide();
	$("#bsOrder_page").show();

	$(".bsOrder_class").remove();
	$("#bsOrder_page").append(elem);
}

/* ============ 获取订单列表 ============ */
let ajaxGetOrders = function() {
	$.ajax({
		type: "GET",
		url: '/getOrders',
		success: function(results) {
			if(results.success == 1) {
				orders = results.orders;	// 获取 orders 数据
				bsOrdersShow(orders);			// 界面显示 orders
			} else {
				alert(results.info);
			}
		}
	});
}
/* ============ 显示订单列表 ============ */
let bsOrdersShow = function(selOrders) {
	let elem = '<div class="bsOrders_class">'
	for(let i=0; i<selOrders.length; i++) {
		let order = selOrders[i];
		elem += '<div class="card bg-light mt-2 p-2">';
			elem += '<div class="row bsOrders_orderCard" id="bsOrders_orderCard-'+order._id+'">';
				elem += '<div class="col-12">';
					let code = 'view';
					if(order.code) code = order.code;
					elem += '<h4>'+code+'</h4>';
				elem += '</div>';

				elem += '<div class="col-6 text-left">';
				if(order.cter) {
					elem += order.cter.nome;
				} else {
					elem += '散客'
				}
				elem += '</div>';
				elem += '<div class="col-6 text-right">';
					elem += '<span class="text-info">';
						if(isNaN(order.imp)){
							elem += 'NaN';
						} else {
							elem += Math.round(order.imp*100)/100
						}
					elem += '</span>';
					elem += '<span> €</span>'
				elem += '</div>';

				if(order.note) {
					elem += '<div class="col-12 text-warning text-left">';
						elem += order.note;
					elem += '</div>';
				}
			elem += '</div>';

			elem += '<div class="row multyDel" style="display:none">';
				elem += '<div class="col-12 text-right">';
					elem += '<button class="delAjax btn btn-danger" data-id='+order._id
					elem += ' type="button">Del</button>';
				elem += '</div>';
			elem += '</div>';
		elem += '</div>';
	}
	elem += '</div>'

	$(".page").hide();
	$("#bsOrders_page").show();

	$(".bsOrders_class").remove();
	$("#bsOrders_page").append(elem);
}




























/* ======== 从添加订单页面 添加新客户 ======== */
let addCterAjax = function() {
	let elem = '<div class="bsOrderAdd_cters_class row m-3 text-center">';
		elem += '<form id="newCter_Form">'
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label text-info" for="iptBsCterAdNome"> 名字 </label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptBsCterAdNome" class="form-control" type="text" '
					elem += 'name="obj[nome]" readonly="readonly" value='+schCterCode+'>'
				elem += '</div>'
				elem += '<div class="col-4"></div>'
				elem += '<div class="col-8 text-danger">'
					elem += '<span id="optBsCterAddName"> </span>'
				elem += '</div>'
			elem += '</div>'

			let vip = 0;
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label" for="iptBsCterAdVip"> VIP </label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptBsCterAdVip" class="form-control" type="number" '
					elem += 'name="obj[vip]" placeholder="用户等级, 默认为0" autocomplete="off" value='+vip+'>'
				elem += '</div>'
			elem += '</div>'
			
			elem += '<div class="form-group row">'
				elem += '<label class="col-4 col-form-label" for="iptBsCterAdTel"> 电话 </label>'
				elem += '<div class="col-8">'
					elem += '<input id="iptBsCterAdTel" class="form-control" type="text" '
					elem += 'name="obj[tel]" autocomplete="off">'
				elem += '</div>'
			elem += '</div>'

			elem += '<div class="form-group row">'
				elem += '<div class="col-8"></div>'
				elem += '<div class="col-4">'
					elem += '<button id="newCter_submit" class="btn btn-info btn-block" '
					elem += 'type="button"> 添加 </button>'
				elem += '</div>'
			elem += '</div>'

		elem += '</form>'
	elem += '</div>'

	$(".bsOrderAdd_cters_class").remove();
	$("#bsOrderAdd_cters").append(elem);

	isOrderAddShowCters = true;
	$("#cterPage").show();
	$("#ordfirsShow").hide();
}
/* ======== 从添加订单页面 显示客户列表 ======== */
let orderAdd_ShowCters = function(selCters, isMatchCter) {
	let elem = '<div class="bsOrderAdd_cters_class row m-3 text-center">';
		for(let i=0; i<selCters.length; i++) {
			if(i== 10) break;
			let cter = selCters[i];
			let nome = cter.nome;
			if(nome.length > 15) nome = nome.slice(0,13)+'...';
			elem += '<div class="col-5 py-3 px-2 m-2 bg-light border selCterBtn" ';
			elem += 'id="selCterBtn-'+cter.nome+'-'+cter._id+'">';
					elem += '<span class="text-info">'+ nome +'</span>';
			elem += '</div>'
		}
		if(!isMatchCter) {
			elem += '<div class="col-5 py-3 px-2 m-2 bg-light border" '
			elem += 'id="newCterBtn"><span class="oi oi-plus"></span>';
			elem += '</div>'
		}
	elem += '</div>'

	$(".bsOrderAdd_cters_class").remove();
	$("#bsOrderAdd_cters").append(elem);

	isOrderAddShowCters = true;
	$("#cterPage").show();
	$("#ordfirsShow").hide();
}
/* ======== 从添加订单页面 隐藏客户列表 ======== */
let orderAdd_HideCters = function() {
	$("#searchCter").val('');

	isOrderAddShowCters = false;
	$("#cterPage").hide();
	$("#ordfirsShow").show();
}

/* ================ 选定 客户 ================ */
let decideCter = function(cterId, cterNome) {
	if(cterId && cterId.length > 20) {
		$("#selCter-Btn").removeClass('btn-secondary');
		$("#selCter-Btn").addClass('btn-info');
	} else {
		$("#selCter-Btn").removeClass('btn-info');
		$("#selCter-Btn").addClass('btn-secondary');
	}
	$("#form_cterIpt").val(cterId);
	$("#selCter-Btn").text(cterNome);

	orderAdd_HideCters();
}