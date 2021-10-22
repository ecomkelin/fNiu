let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../config/conf');

let Pdfir = require('../../../models/material/pdfir');
let Nome = require('../../../models/material/nome');

let _ = require('underscore');

exports.bsNomeRevise = function(req, res) {
	let crUser = req.session.crUser;
	Pdfir.find({
		'firm': crUser.firm,
	},{nome: 1})
	.exec(function(err, pdfirs) {
		if(err) {
			info = "bsNomeRevise Pdfir.find, Error！";
			Err.usError(req, res, info);
		} else {
			Nome.deleteMany({'firm': crUser.firm}, function(err, nomesdel) {
				if(err) console.log(err);

				bsSetNomes(req, res, pdfirs, 0)
			})
		}
	})
}
let bsSetNomes = function(req, res, pdfirs, n) {
	if(n == pdfirs.length) {
		res.redirect('/bsNomes')
	} else {
		let crUser = req.session.crUser;
		let pdfir = pdfirs[n];
		if(!pdfir.nome || pdfir.nome.length == 0) {
			pdfir.nome = 'undefine'
		}
		pdnome = pdfir.nome.replace(/\s+/g,"").toUpperCase();
		if(pdnome != pdfir.nome) {
			pdfir.nome = pdnome;
			pdfir.save(function(err, pdfirSave) {
				if(err) console.log(err);
			})
		}
		Nome.findOne({'firm': crUser.firm, 'code': pdnome})
		.exec(function(err, nome) {
			if(err) console.log(err);
			if(nome) {
				nome.quant++;
				nome.save(function(err, nomeSave) {
					if(err) console.log(err);
					bsSetNomes(req, res, pdfirs, n+1);
				})
			} else {
				let _nome = new Nome();	// 创建nome
				_nome.code = pdnome;
				_nome.firm = crUser.firm;
				_nome.save(function(err, nomeSave) {
					if(err) console.log(err);
					bsSetNomes(req, res, pdfirs, n+1);
				})
			}
		})
	}
}

exports.bsNomes = function(req, res) {
	let crUser = req.session.crUser;
	Nome.find({
		// 'firm': crUser.firm,
	})
	.sort({'status': -1, 'weight': -1, 'upAt': -1, 'quant': -1})
	.exec(function(err, nomes) {
		if(err) {
			info = "bser nomes, nome find, Error！";
			Err.usError(req, res, info);
		} else {
			// for(let i=0; i<nomes.length; i++) {
			// 	console.log(nomes[i].upAt)
			// }
			res.render('./user/bser/nome/list', {
				title : '产品名称列表',
				crUser: crUser,

				nomes: nomes,
			});
		}
	})
}


exports.bsNome = function(req, res) {
	let crUser = req.session.crUser;
	
	let id = req.params.id;

	Nome.findOne({
		'firm': crUser.firm,
		'_id': id
	})
	.exec(function(err, nome) {
		if(err) {
			info = "bser nome, nome findOne, Error！";
			Err.usError(req, res, info);
		} else if(!nome) {
			info = "没有找到此模特, 请刷新重试"
		} else {
			res.render('./user/bser/nome/detail', {
				title : '模特记录',
				crUser: crUser,

				nome: nome,
			});
		}
	})
}


exports.bsNomeAdd = function(req, res) {
	let crUser = req.session.crUser;

	res.render('./user/bser/nome/add', {
		title : '添加模特',
		crUser: crUser,
	});
}


exports.bsNomeNew = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	obj.firm = crUser.firm;
	obj.creater = crUser._id;
	/* ================= 数字转化 =================== */
	if(obj.price) {
		obj.price = parseFloat(obj.price);
	} else {
		obj.price = 0;
	}
	if(obj.cost) {
		obj.cost = parseFloat(obj.cost);
	} else {
		obj.cost = 0;
	}
	/* ================= 数字转化 =================== */


	if(!obj.code || isNaN(obj.price) || isNaN(obj.cost)) {
		info = "数据输入有误！";
		Err.usError(req, res, info);
	} else {
		// console.log(obj)

		/* =========== 公司不能出现同一个型号的模特 ============= */
		Nome.findOne({code: obj.code, 'firm': crUser.firm})
		.exec(function(err, nomeSame) {
			if(err) {
				console.log(err);
				info = "bsProductNew, Nome.findOne, Error!";
				Err.usError(req, res, info);
			} else if(nomeSame) {
				info = "此产品号已经存在，请重新填写";
				Err.usError(req, res, info);
			} else {
				let _nome = new Nome(obj);	// 创建nome
				_nome.save(function(err, nomeSave) {
					if(err) {
						console.log(err);
						info = "添加新产品时，数据库保存出错, 请联系管理员";
						Err.usError(req, res, info);
					} else {
						res.redirect('/bsNomes')
					}
				})
			}
		})
	}
}



exports.bsNomeUpd = function(req, res, next) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	if(req.body.objId) obj._id = req.body.objId;
	if(obj.price) obj.price = parseFloat(obj.price);
	if(obj.cost) obj.cost = parseFloat(obj.cost);
	if(obj.stock) obj.stock = parseInt(obj.stock);
	if(obj.sales) obj.sales = parseInt(obj.sales);
	Nome.findOne({_id: obj._id}, function(err, nome) {
		if(err) {
			console.log(err);
			info = "bsProductUpd, Nome.findOne, Error！";
			Err.usError(req, res, info);
		} else if(!nome) {
			info = "数据库中没有此模特, 刷新查看";
			Err.usError(req, res, info);
		} else {
			if(obj.stockPlus) {
				stockPlus = parseInt(obj.stockPlus)
				if(!isNaN(stockPlus)) {
					obj.stock = parseInt(nome.stock) + stockPlus;
				}
			}
			let _nome = _.extend(nome, obj)
			_nome.save(function(err, nomeSave) {
				if(err) {
					console.log(err);
					info = "bsProductUpd, _nome.save, Error！";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bsNomes')
				}
			})
		}
	})
}




exports.bsProdFilter = function(req, res, next) {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Nome.findOne({_id: id, 'firm': crUser.firm})
	.populate({path: 'pdsecs', populate: {path: 'pdthds', populate: [
		{path: 'ordthds'}, {path: 'hordthds'},
		{path: 'macthds'},
		{path: 'tinthds'},
		{path: 'pdsez'},
	]}})
	.populate({path: 'pdsezs', populate: [
		{path: 'pdthds', populate: [
			{path: 'ordthds'}, {path: 'hordthds'},
			{path: 'macthds'},
			{path: 'tinthds'},
			{path: 'pdsez'},
		]},
		{path: 'macsezs'},
	]})
	.populate({path: 'ordfirs', populate: [
		{path: 'order'},
		{path: 'ordsecs', populate: {path: 'ordthds'}}
	]})
	// .populate({path: 'hordfirs', populate: [
	// 	{path: 'order'},
	// 	{path: 'ordsecs', populate: {path: 'ordthds'}}
	// ]})
	.populate({path: 'macfirs', populate: [
		{path: 'machin'},
		{path: 'macsecs', populate: {path: 'macthds'}}
	]})
	.populate({path: 'tinfirs', populate: [
		{path: 'tinhin'},
		{path: 'tinsecs', populate: {path: 'tinthds'}}
	]})
	.exec(function(err, nome) {
		if(err) {
			console.log(err);
			info = "查看产品信息时，数据库查找出错, 请联系管理员";
			Err.usError(req, res, info);
		} else if(!nome) {
			info = "此产品已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(nome.pdsezs[0])
			req.body.nome = nome;
			next();
		}
	})
}





exports.bsNomeDel = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Nome.findOne({_id: id, 'firm': crUser.firm})
	.exec(function(err, nome){
		if(err) {
			console.log(err);
			info = "bsNomeDel, Nome.findOne, Error！";
			Err.usError(req, res, info);
		} else if(!nome) {
			info = "此产品已经被删除, 请刷新查看!";
			Err.usError(req, res, info);
		} else {
			let orgPhoto = nome.photo;
			MdPicture.deleteOldPhoto(orgPhoto, Conf.photoPath.proPhoto);
			Nome.deleteOne({_id: nome._id}, function(err, objRm) {
				if(err) {
					info = "bsNomeDel, Nome.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bsNomes');
				}
			})
		}
	})
}

exports.bsNomeChStsAjax = function(req, res) {
	let crUser = req.session.crUser;
	let nomeId = req.query.nomeId;
	let status = req.query.status;
	Nome.findOne({_id: nomeId, 'firm': crUser.firm})
	.exec(function(err, nome) {
		if(err) console.log(err);
		if(!nome) {
			res.json({success: 0, info: "bsCterDelAjax, Cter.deleteOne,Error!"})
		} else {
			nome.status = parseInt(status);
			nome.save(function(err, nomeSave) {
				if(err) console.log(err);
				res.json({success: 1})
			})
		}
	})
}

exports.bsGetNomesAjax = function(req, res) {
	let crUser = req.session.crUser;
	let keyword = req.query.keyword;
	let keyReg = '';
	if(req.query.keyword) {
		keySymb = '$in';
		keyReg = String(req.query.keyword);
		keyReg = keyReg.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		keyReg = new RegExp(keyReg + '.*');
	}
	let status = req.query.status;
	Nome.find({
		'firm': crUser.firm,
		'code': {'$in': keyReg}
	})
	.exec(function(err, nomes) {
		if(err) {
			console.log(err);
			res.json({success: 0, info: "bser GetNomesAjax, Cter.find, Error!"})
		} else {
			res.json({success: 1, nomes})
		}
	})
}