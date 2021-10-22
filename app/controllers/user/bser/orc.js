let Err = require('../../aaIndex/err');

let Pdfir = require('../../../models/material/pdfir');
let Orc = require('../../../models/client/orc');
let Orcpd = require('../../../models/client/orcpd');

exports.bsOrcs = function(req, res) {
	let crUser = req.session.crUser;

	res.render('./user/bser/orc/listDeal', {
		title : '订单信息',
		crUser,
	});
}

exports.bsHisOrcs = function(req, res) {
	let crUser = req.session.crUser;

	res.render('./user/bser/orc/listHis', {
		title : '订单信息',
		crUser,
	});
}

exports.bsOrc = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Orc.findOne({_id: id, firm: crUser.firm})
	.populate('firm')
	.populate('cter')
	.populate({path: 'orcpds', populate: {path: 'pdfir'}})
	.exec(function(err, orc) {
		if(err) {
			console.log(err);
			info = "cter Orc SubAjax, Orc.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!orc) {
			info = "cter OrcSubAjax, 请刷新重试"
			Err.usError(req, res, info);
		} else {
			res.render('./user/bser/orc/detail', {
				title : '订单信息',
				crUser,
				orc
			});
		}
	})
}

exports.bsOrcSubAjax = function(req, res) {
	let crUser = req.session.crUser;
	let orcId = req.query.orcId;

	Orc.findOne({_id: orcId, firm: crUser.firm}, {'status': 1})
	.exec(function(err, orc) {
		if(err) {
			console.log(err);
			info = "cter Orc SubAjax, Orc.findOne, Error!"
			res.json({success: 0, info})
		} else if(!orc) {
			info = "cter OrcSubAjax, 请刷新重试"
			res.json({success: 0, info})
		} else {
			orc.status = 10;
			orc.save(function(err, orcSave) {
				if(err) {
					console.log(err);
					info = "cter Orc DelAjax, orc.save, Error!"
					res.json({success: 0, info})
				} else {
					res.json({success: 1})
				}
			})
		}
	})
}