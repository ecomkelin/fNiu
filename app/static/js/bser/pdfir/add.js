$(function() {

	const clearData = () => {
		$("#bsProdNew").attr('action', '/bsPdfirNew');
		$("#objId").val('')
		$("#iptNome").val('')
		$("#iptMaterial").val('')
		$("#iptPrice").val('')
		$("#iptCost").val(0)
		$("#rowStock").show();
		$("#rowStockPlus").hide();
		$("#iptStockPlus").val(0);
	}
	$("#iptCode").blur(function(e) {
		const code = $("#iptCode").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(code.length < 2) {
			$("#optCode").text("请输入编号, 至少两个编号");
			$("#optCode").show();
			clearData();
		} else {
			let codeUrI = encodeURIComponent(code)
			$.ajax({
				type: 'GET',
				url: '/bsPdAjaxCode?code=' + codeUrI
			})
			.done(function(results) {
				if(results.success === 1) {
					let pdfir = results.pdfir;
					$("#bsProdNew").attr('action', '/bsPdfirUpd');
					$("#objId").val(pdfir._id)
					$("#iptNome").val(pdfir.nome)
					$("#iptMaterial").val(pdfir.material)
					$("#iptPrice").val(pdfir.price)
					$("#iptCost").val(pdfir.cost)
					$("#rowStock").hide();
					$("#nowStock").text(pdfir.stock)
					$("#rowStockPlus").show();

				} else {
					clearData();
					$("#optCode").hide();
				}
			})
		}
	})
	$("#iptPrice").blur(function(e) {
		let price = $(this).val();
		if(!jsFunc_isFloat(price)) {
			$("#optPrice").show();
		} else {
			$("#optPrice").hide();
		}
	})
	$("#iptCost").blur(function(e) {
		let cost = $(this).val();
		if(!jsFunc_isFloat(cost)) {
			$("#optCost").show();
		} else {
			$("#optCost").hide();
		}
	})
	$("#bsProdNew").submit(function(e) {
		let code = $("#iptCode").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		let price = $("#iptPrice").val();
		let cost = $("#iptCost").val();
		if(code.length < 2) {
			$("#optCode").text("请输入编号, 至少两个编号");
			$("#optCode").show();
			e.preventDefault();
		} else if(!jsFunc_isFloat(price)) {
			$("#optPrice").show();
			e.preventDefault();
		} else if(!jsFunc_isFloat(cost)) {
			$("#optCost").show();
			e.preventDefault();
		}
	})

	$("#bsProdNew").on('input', "#iptNome", function(e) {
		let str = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		$.ajax({
			type: "GET",
			url: "/bsGetNomesAjax?keyword="+str,
			success: function(results) {
				if(results.success === 1) {
					let nomes = results.nomes
					let elem = "";
					for(let i=0; i<nomes.length; i++) {
						let nome = nomes[i];
						elem += '<div class="col-6 col-md-2 nomeBtnBox">'
							elem += '<button class="nomeBtn btn btn-default" data-nome="'
							elem += nome.code+'" type="button">'+ nome.code + '</button>'
						elem += '</div>'
					}
					$(".nomeBtnBox").remove();
					$("#nomeShow").append(elem)
				} else if(results.success === 0) {
					alert(results.msg);
				}
			}
		});
	})
	$("#nomeShow").on('click', '.nomeBtn', function(e) {
		let target = $(e.target);
		let nome = target.data('nome');
		$("#iptNome").val(nome);
		$(".nomeBtnBox").remove();
	})
})