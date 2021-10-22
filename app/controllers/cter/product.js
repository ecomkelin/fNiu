let Err = require('../aaIndex/err');

let Pdfir = require('../../models/material/pdfir');
let Nome = require('../../models/material/nome');
let Orc = require('../../models/client/orc');
let Orcpd = require('../../models/client/orcpd');

exports.products = function(req, res) {
	let crCter = req.session.crCter;
	let firm = req.session.firm;
	let keyword = req.query.keyword;

	res.render('./cter/product/list', {
		title : '产品列表',
		crCter,
		keyword,
	});
}

exports.product = function(req, res) {
	let crCter = req.session.crCter;
	let firm = req.session.firm;
	let id = req.params.id;
	if(crCter) {
		firm = crCter.firm;
		Pdfir.findOne({_id: id})
		.populate('colors')
		.exec(function(err, pdfir) {
			if(err) {
				console.log(err);
				info = "cter product Pdfir.findOne, Error!"
				Err.usError(req, res, info);
			} else if(!pdfir) {
				info = "没有找到产品, 请刷新重试"
				Err.usError(req, res, info);
			} else {
				Orc.findOne({
					'firm': firm,
					'cter': crCter._id,
					'status': 1
				})
				.populate('orcpds')
				.exec(function(err, orc) {
					if(err) {
						console.log(err);
						info = "cter product Pdfir.findOne, Error!"
						Err.usError(req, res, info);
					} else if(!orc) {
						let objOrc = new Object();
						objOrc.firm = crCter.firm;
						objOrc.cter = crCter._id;
						objOrc.imp = 0;
						let _objOrc = new Orc(objOrc)
						_objOrc.save(function(err, orc){
							if(err) {
								console.log(err);
								info = "product, _objOrc.save, Error!";
								Index.adOptionWrong(req, res, info);
							} else {
								let orcpd = null;
								res.render('./cter/product/detail', {
									title : '产品信息',
									crCter,
									pdfir,
									orc,
									orcpd
								});
							}
						})
					} else {
						let orcpd = null;
						for(let i=0; i<orc.orcpds.length; i++) {
							if(String(orc.orcpds[i].pdfir) == String(pdfir._id)) {
								orcpd = orc.orcpds[i];
							}
						}
						// console.log(orcpd)
						res.render('./cter/product/detail', {
							title : '产品信息',
							crCter,
							pdfir,
							orc,
							orcpd
						});
					}
				})
			}
		})
	} else {
		Pdfir.findOne({_id: id})
		.populate('colors')
		.exec(function(err, pdfir) {
			if(err) {
				console.log(err);
				info = "cter product Pdfir.findOne, Error!"
				Err.usError(req, res, info);
			} else if(!pdfir) {
				info = "没有找到产品, 请刷新重试"
				Err.usError(req, res, info);
			} else {
				res.render('./cter/product/detail', {
					title : '产品信息',
					pdfir,
				});
			}
		})
	}

}

exports.pdnomes = function(req, res) {
	let crCter = req.session.crCter;
	let firm = req.session.firm;
	if(crCter) firm = crCter.firm;

	Nome.find({
		'firm': firm,
	})
	.sort({'status': -1})
	.exec(function(err, nomes) {
		if(err) {
			console.log(err);
			info = "cter pdnomes Nome.find, Error!"
			Err.usError(req, res, info);
		} else {
			res.render('./cter/product/pdnomes', {
				title : '产品分类列表',
				crCter: crCter,

				nomes: nomes,
			});
		}
	})
}
