const Pdfir = require('../../../models/material/pdfir');


exports.usPdfirsAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const crCter = req.session.crCter;
		let firm = req.session.firm;
		if(crCter) {
			firm = crCter.firm;
		} else if(crUser) {
			firm = crUser.firm;
		}
		// console.log(firm)

		let page = 1;
		if(req.query.page && !isNaN(parseInt(req.query.page))) {
			page = parseInt(req.query.page);
		}
		let pagesize = 12;
		if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
			pagesize = parseInt(req.query.pagesize);
		}
		let skip = (page-1)*pagesize;

		let nomeSymb = '$ne';
		let nomeCond = 'rander[a`a。=]';
		if(req.query.nome) {
			nomeSymb = '$eq';
			nomeCond = req.query.nome;
		}

		let keySymb = '$ne';
		let keyReg = 'rander[a`a。=]';
		if(req.query.keyword) {
			keySymb = '$in';
			keyReg = String(req.query.keyword);
			keyReg = keyReg.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			keyReg = new RegExp(keyReg + '.*');
		}

		let rcmdSymb = '$ne';
		let rcmdConb = -1;

		if(req.query.rcmd && !isNaN(parseInt(req.query.rcmd))) {
			rcmdSymb = '$eq';
			rcmdConb = parseInt(req.query.rcmd)
		}

		let param = {
			firm: firm,
			rcmd: {[rcmdSymb]: rcmdConb},

			'nome': {[nomeSymb]: nomeCond},
			$or:[
				{'code': {[keySymb]: keyReg}},
				{'nome': {[keySymb]: keyReg}},
			]
		}
		const count = await Pdfir.countDocuments(param)
		const pdfirs = await Pdfir.find(param)
		.skip(skip).limit(pagesize)
		.sort({'rcmd': -1, 'weight': -1, 'upAt': -1})
		let isMore = 1;
		if(page*pagesize >= count) isMore = 0;
		return res.json({status: 1, data: {pdfirs, count, page, isMore} });
	} catch(error) {
		console.log(error);
		return res.json({status: 0, msg: "cter PdfirsAjax, Pdfir.find(), Error!"});
	}
}