let Err = require('../../aaIndex/err');
let Pdfir = require('../../../models/material/pdfir');

let _ = require('underscore');

exports.getPdfirs = function(req, res) {
	let crUser = req.session.crUser;

	Pdfir.find({'firm': crUser.firm})
	.sort({'upAt': -1})
	.exec(function(err, pdfirs) {
		if(err) {
			info = "get Pdfirs, 请联系管理员";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, pdfirs: pdfirs})
		}
	})
}
