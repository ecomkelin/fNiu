var page = 0;
var count;
var isMore;
var orcsAll = new Array();
var getOrcs = (urlQuery, elemId, isReload, role) => {
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
					let orcs = results.data.orcs;
					for(let j=0; j<orcs.length; j++) {
						orcsAll.push(orcs[j])
					}
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#orcCount").text(count)
					orcsRender(orcs, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var orcsRender = (orcs, elemId, isReload, role) => {
	let elem = '<div class="row orcsElem">'
		for(let i=0; i<orcs.length; i++) {
			let orc = orcs[i];
			elem += orcRender(orc, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".orcsElem").remove();
	if(!elemId) elemId = "#orcsElem";
	$(elemId).append(elem);
}
var orcRender = (orc, role) => {
	let orcDetail = '/'+role+'Orc/'+orc._id;
	if(role == 'ct') {
		orcDetail = '/order/'+orc._id;
	}
	let bsCter = '#';
	if(role != 'ct' && orc.cter) {
		bsCter = '/bsCter/'+orc.cter._id;
	}

	let elem = '';
	elem += '<div class="col-lg-6 my-2 orcCard card py-3">'		
		elem += '<div class="row">'
			elem += '<div class="col-5">'
				elem += '<a class="text-primary" href='+orcDetail+'>'
					elem += '<div>'+orc.code+'</div>'
				elem += '</a>'
			elem += '</div>'
			elem += '<div class="col-4">'
				if(role == 'ct') {
					
				} else {
					if(orc.cter) {
						elem += '<a class="text-primary" href='+bsCter+'>'
							elem += '<div>'+orc.cter.nome+'['+orc.cter.code+']</div>'
						elem += '</a>'
					} else {
						elem += '<div>客户数据丢失</div>'
					}
				}
			elem += '</div>'
			elem += '<div class="col-3 text-right">'
					elem += '<div>'+orc.imp+' €</div>'
			elem += '</div>'
		elem += '</div>'
		if($("#crCter").val()) {
			let price = parseFloat(orc.price);
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