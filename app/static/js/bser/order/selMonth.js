$( function() {

	// 添加 日期 行元素
	let singledateRow = function(ym, begin, ended) {
		let ident = begin;
		let elem;
		elem = '<div class="row singlemonth mt-2 py-2">';
			elem += '<div class="col-4">';
				elem += '<span>'+ym+'</span>';
			elem += '</div>';
			elem += '<div class="col-1 text-warning shield">';
				elem += '<span class="oi oi-shield"></span>';
			elem += '</div>';
			elem += '<div class="col-3 text-info text-center">';
				elem += '<span id="slen_'+ident+'"></span>';
			elem += '</div>';
			elem += '<div class="col-4 text-right">';
				elem += '<span id="stot_'+ident+'" class="text-info"></span>';
				elem += '<span> €</span>';
			elem += '</div>';
		elem += '</div>';

		$('.month').append(elem);
	}
	// 添加order 元素
	let orderRow = function(order, ident) {
		let elem;
		elem = '<div class="card bg-light mt-2 p-2 singlemonth smonthshow_'+ident+' card-'+order._id+'" id="orderCard-'+order._id+'">';
			elem += '<div class="row">';
				elem += '<div class="col-12 text-left">';
					let code = 'view';
					if(order.code) code = order.code;
					let textSts = 'text-warning';
					if(order.status == 10) {
						textSts = 'text-danger'
					} else if(order.status == 0) {
						textSts = 'text-dark'
					}
					elem += '<h4 class="'+textSts+'">'+code+'</h4>';
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
		elem += '</div>';
		$('.month').append(elem);
	}

	// 添加 正在加载 元素
	let loading = function() {
		let elem;
		elem = '<div class="loading text-warning text-center mt-3">';
			elem += '<h4>正在加载...</h4>';
		elem += '</div>';
		$('.month').append(elem);
	}
	// 获取orders
	let getsdOrders = function(begin, ended) {
		loading();

		let ident = begin;
		let bserCode = $("#selUserCode").val();
		$.ajax({
			type: 'GET',
			url: '/bsOrdersMonthAjax?begin=' + begin + '&ended=' + ended + '&selUserCode='+bserCode
		})
		.done(function(results) {
			if(results.success === 1) {
				let orders = results.orders;
				let len = orders.length;
				$("#slen_"+ident).text(len+'单')
				// alert(orders[0].ctAt)
				let tot = 0;
				for(let i=0; i<len; i++) {
					let order = orders[i];
					if(!isNaN(order.imp)){
						tot += order.imp;
					}
					orderRow(order, ident);
				}

				$("#stot_"+ident).text(tot.toFixed(2))
				$('.loading').remove();
			} else {

			}
		})
	}
	$("#selMonth").change(function(e) {
		$('.singlemonth').remove()
		let strs = $("#selMonth").val().split('-');
		// alert(strs)
		let ym = strs[0];
		let begin = parseInt(strs[1]);
		let ended = parseInt(strs[2]);
		singledateRow(ym, begin, ended);
		getsdOrders(begin, ended);
	});

	let monthinit = function() {
		let strs = $("#selMonth").val().split('-');
		let ym = strs[0];
		let begin = parseInt(strs[1]);
		let ended = parseInt(strs[2]);
		singledateRow(ym, begin, ended);
		getsdOrders(begin, ended);
	}
	monthinit();








	$(".month").on("click", ".shield", function(e) {
		$(".multyDel").toggle();
	})
	$(".month").on("click", ".delAjax", function(e) {
		let target = $(e.target)
		let id = target.data('id')
		let div = $('.card-' + id)
		$.ajax({
			type: 'DELETE',
			url: '/bsOrderDelAjax?id=' + id
		})
		.done(function(results) {
			if(results.success === 1) {
				if(div.length >0) {
					div.remove()
				}
			}
			if(results.success === 0) {
				alert(results.info)
			}
		})
	})
} );