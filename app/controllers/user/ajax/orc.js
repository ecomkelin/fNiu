let Err = require('../../aaIndex/err');
let Conf = require('../../../config/conf');

let Orc = require('../../../models/client/orc');

exports.usOrcsAjax = async(req, res) => {
	try {

		let crUser = req.session.crUser;
		let crCter = req.session.crCter;
		if(!crCter && !crUser) return res.json({status: 0, msg: "请登录"});
		let firm;
		let cterSymb;
		let cterCond;

		if(crUser) {
			firm = crUser.firm;
			cterSymb = '$ne';
			cterCond = null;
			if(req.query.cter) {
				cterSymb = '$eq';
				cterCond = req.query.cter;
			}
		} else if(crCter) {
			firm = crCter.firm;
			cterSymb = '$eq';
			cterCond = crCter._id;
		}

		let page = 1;
		if(req.query.page && !isNaN(parseInt(req.query.page))) {
			page = parseInt(req.query.page);
		}
		let pagesize = 12;
		if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
			pagesize = parseInt(req.query.pagesize);
		}
		let skip = (page-1)*pagesize;

		let keySymb = '$ne';
		let keyReg = 'rander[a`a。=]';
		if(req.query.keyword) {
			keySymb = '$in';
			keyReg = String(req.query.keyword);
			keyReg = keyReg.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			keyReg = new RegExp(keyReg + '.*');
		}
		
		let statusSymb;
		let statusCond;
		statusSymb = '$ne';
		statusCond = 1;
		if(req.query.status) {
			statusSymb = '$eq';
			statusCond = req.query.status;
		}

		let param = {
			firm: firm,
			'status': {[statusSymb]: statusCond},
			'cter': {[cterSymb]: cterCond},
			'code': {[keySymb]: keyReg},
		}
		const count = await Orc.countDocuments(param)
		const orcs = await Orc.find(param)
			.populate('firm')
			.populate('cter')
			// .populate({path: 'orcpd', populate: {path: 'pdfir'}})
			.skip(skip).limit(pagesize)
			.sort({'ctAt': -1})
		let isMore = 1;
		if(page*pagesize >= count) isMore = 0;
		return res.json({status: 1, data: {orcs, count, page, isMore, } });
	} catch(error) {
		console.log(error);
		return res.json({status: 0, msg: "cter OrcsAjax, Orc.find(), Error!"});
	}
}