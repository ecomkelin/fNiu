let Err = require('../../aaIndex/err');

let Cter = require('../../../models/client/cter');

exports.getCters = function(req, res) {
	let crUser = req.session.crUser;

	Cter.find({'firm': crUser.firm,})
	.sort({'vip': -1})
	.exec(function(err, cters) {
		if(err) {
			console.log(err);
			info = "bsCters, Cter.find, Error！";
			res.json({success: 0, info: info});
		} else {
			res.json({success: 1, cters: cters});
		}
	})
}