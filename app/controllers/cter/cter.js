let Err = require('../aaIndex/err');

let Firm = require('../../models/login/firm');
let Cter = require('../../models/client/cter');
let Pdfir = require('../../models/material/pdfir');
let Orc = require('../../models/client/orc');

exports.cter = function(req, res) {
	let crCter = req.session.crCter;
	let firm = req.session.firm;
	if(crCter) frim = crCter.firm;
	res.render('./cter/index/index', {
		title: '首页',
		crCter,
		firm
	})
}

exports.ctCter = function(req, res) {
	let crCter = req.session.crCter;
	if(!crCter) {
		res.redirect('/login');
	} else {
		Orc.findOne({cter: crCter._id, status: 1})
		.populate('firm')
		.populate({path: 'orcpds', populate: {path: 'pdfir'}})
		.exec(function(err, orc) {
			if(err) {
				console.log(err);
				info = "cter myself, Orc.findOne, Error!"
				Err.usError(req, res, info);
			} else {
				res.render('./cter/index/cter', {
					title: '个人中心',
					crCter,
					orc
				})
			}
		})
	}
}