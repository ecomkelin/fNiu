let Err = require('../../../aaIndex/err');

let Ordfir = require('../../../../models/client/ordfir');

/* ============ 查看pd的销量 ============ */
exports.bsOrdfirsPd = function(req, res) {
	let crUser = req.session.crUser;
	let pdfirId = req.query.pdfirId;
	
	Ordfir.find({
		'firm': crUser.firm,
		'pdfir': pdfirId,
	})
	.populate('cter')
	.exec(function(err, ordfirs) {
		if(err) {
			console.log(err);
			info = "bser Ordfirs acord pd, Error!";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, ordfirs: ordfirs})
		}
	})
}

/* ============ 查看客户的销量 ============ */
exports.bsOrdfirsCt = function(req, res) {
	let crUser = req.session.crUser;
	let cterId = req.query.cterId;
	
	Ordfir.find({
		'firm': crUser.firm,
		'cter': cterId,
	})
	.populate('pdfir')
	.exec(function(err, ordfirs) {
		if(err) {
			console.log(err);
			info = "bser Ordfirs acord pd, Error!";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, ordfirs: ordfirs})
		}
	})
}


/* ============ 查看Cter的销量 ============ */
exports.bsOrdfirsCter = function(req, res) {
	let crUser = req.session.crUser;
	let cterId = req.query.cterId;
	
	let symAtFm = "$ne";
	let symAtTo = "$ne";
	let condAtFm = new Date(new Date().setHours(0, 0, 0, 0));
	let condAtTo = new Date(new Date().setHours(23, 59, 59, 999))
	if(req.query.atFm && req.query.atFm.length == 10){
		symAtFm = "$gte";
		condAtFm = new Date(req.query.atFm).setHours(0,0,0,0);
	}
	if(req.query.atTo && req.query.atTo.length == 10){
		symAtTo = "$lte";
		condAtTo = new Date(req.query.atTo).setHours(23,59,59,999);
	}

	Ordfir.find({'firm': crUser.firm,
		'cter': cterId,
		'ctAt': {[symAtFm]: condAtFm, [symAtTo]: condAtTo}
	})
	.populate('pdfir')
	.exec(function(err, ordfirs) {
		if(err) {
			console.log(err);
			info = "bser Ordfirs acord pd, Error!";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, ordfirs: ordfirs})
		}
	})
}