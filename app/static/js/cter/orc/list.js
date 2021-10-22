$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let orcParam = '';
	let orcElemId = '';
	let role = '';
	let ifload = '';
	var searchFunction = function() {
		let keyword = '';
		if($(".orcSearch").val()) {
			keyword = $(".orcSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		}
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#pdnomeAll").removeClass("btn-default");
			$("#pdnomeAll").addClass("btn-success");
		}
		
		page = 0;
		urlQuery = orcParam + keyword;
		getOrcs(urlQuery, orcElemId, 1, role);
	}
	orcsInit = () => {
		let orcFilter = $("#orcFilterAjax").val();
		if(orcFilter) {
			orcParam = orcFilter.split('@')[0];
			orcElemId = orcFilter.split('@')[1];
			role = orcFilter.split('@')[2];
		}
		ifload = $("#ifload").val();
		urlQuery = orcParam;
		searchFunction();
		// getOrcs(urlQuery, orcElemId, 1, role);
	}
	orcsInit();
	var pdnomeListOpt = function(pdnome) {
		if(!pdnome || pdnome.length < 1) {
			pdnome = '';
		} else {
			pdnome = "&pdnome=" + pdnome;
		}

		page = 0;
		urlQuery = orcParam + pdnome;
		getOrcs(urlQuery, orcElemId, 1, role);

		$(".orcSearch").val('');
	}
	// if(getUrlParam("pdnome") != null) {
	// 	setTimeout(function(){
	// 		let pdnome = getUrlParam("pdnome");
	// 		$("#pdnomeSel").val(pdnome)
	// 		pdnomeListOpt(pdnome)
	// 	}, 300)
	// }
	/* ====== 点击品类名 显示系列 ====== */
	$("#pdnomeSel").change(function(e) {
		let pdnome = $(this).val();
		pdnomeListOpt(pdnome);
	})

	/* ====== 根据搜索关键词 显示系列 ====== */
	$(".orcSearch").blur((e) => {
		searchFunction();
	})
	var searchFunction = function() {
		let keyword = $(".orcSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#pdnomeAll").removeClass("btn-default");
			$("#pdnomeAll").addClass("btn-success");
		}
		
		page = 0;
		urlQuery = orcParam + keyword;
		getOrcs(urlQuery, orcElemId, 1, role);
	}

	$(".ifload").click(function(e) {
		ifload = "loadyes"
		$(this).hide();
	})
	$(window).scroll(function(){
		if(ifload != "loadno") {
			var scrollTop = $(this).scrollTop();
			var windowHeight = $(this).height();
			var scrollHeight = $(document).height();
			if(scrollTop + windowHeight + 58 > scrollHeight){
				// alert('page:'+page+' count:'+count)
				if(isMore == 1) {
					// $(orcElemId).append('<h3 class="text-center mt-3 text-info timeloading"> 正在加载... </h3>')
					setTimeout(function(){
						getOrcs(urlQuery+'&page='+(parseInt(page)+1), orcElemId, 0, role);
						var browH = $(window).height()
						var bodyH = $(document.body).height()
						if(bodyH < browH) {
							footH = browH - bodyH
							$('.js-browserHeight-autoFooter').height(footH)
						} else {
							$('.js-browserHeight-autoFooter').height(0)
						}
						// $(".timeloading").remove();
					}, 1000)
					
				}
			}
		}
	});	
})