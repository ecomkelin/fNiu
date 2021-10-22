let Err = require('../../../aaIndex/err');

let Cter = require('../../../../models/client/cter');
let Order = require('../../../../models/client/order');

let _ = require('underscore');

exports.bsCterAdd = function(req, res) {
	let crUser = req.session.crUser;

	res.render('./user/bser/cter/add', {
		title : '添加客户',
		crUser: crUser,
	});
}

exports.bsCters = function(req, res) {
	let crUser = req.session.crUser;
	let keyword = '';
	if(req.query.keyword) keyword = req.query.keyword.replace(/\s+/g,"").toUpperCase();
	let keywordReg = new RegExp(keyword + '.*');

	Cter.find({
		'firm': crUser.firm,
		$or:[
			{'code': {'$in': keywordReg}},
			{'nome': {'$in': keywordReg}},
		]
	})
	.sort({'vip': -1})
	.exec(function(err, cters) {
		if(err) {
			console.log(err);
			info = "bsCters, Cter.find, Error！";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bser/cter/list', {
				title : '客户列表',
				crUser: crUser,

				cters: cters
			});
		}
	})
}

exports.bsCter = function(req, res) {
	let crUser = req.session.crUser;
	let cterId = req.params.cterId;

	Cter.findOne({'firm': crUser.firm, '_id': cterId})
	.exec(function(err, cter) {
		if(err) {
			console.log(err);
			info = "bsCters, Cter.find, Error！";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bser/cter/detail', {
				title : '客户详情',
				crUser: crUser,

				cter: cter
			});
		}
	})
}
exports.bsCterDel = function(req, res) {
	let crUser = req.session.crUser;
	let cterId = req.params.cterId;

	Cter.findOne({'firm': crUser.firm, '_id': cterId})
	.exec(function(err, cter) {
		if(err) {
			console.log(err);
			info = "bsCters, Cter.find, Error！";
			Err.usError(req, res, info);
		} else if(!cter){
			res.redirect('/bsCters')
		} else {
			Cter.deleteOne({_id: cter._id}, function(err, objRm) {
				if(err) {
					console.log(err);
					info = "bser CterDel, Cter.deleteOne,Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bsCters')
				}
			})
		}
	})
}

exports.bsCterDelAjax = function(req, res) {
	let crUser = req.session.crUser;

	let id = req.query.id;
	Cter.findOne({_id: id, 'firm': crUser.firm})
	.exec(function(err, cter){ 
		if(err) {
			res.json({success: 0, info: "bsCterDelAjax, Cter.findOne, Error"})
		} else if(!cter){
			res.json({success: 0, info: "此客户已经被删除"})
		} else {
			Cter.deleteOne({_id: cter._id}, function(err, objRm) { if(err) {
				res.json({success: 0, info: "bsCterDelAjax, Cter.deleteOne,Error!"})
			} else {
				res.json({success: 1})
			} })
		}
	})
}




exports.bsCterUpd = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	if(obj.nome) obj.nome= obj.nome.replace(/\s+/g,"").toUpperCase();
	if(obj.vip) obj.vip = parseInt(obj.vip);
	Cter.findOne({_id: obj._id, 'firm': crUser.firm})
	.exec(function(err, cter) {
		if(err) {
			info = "bser CterUpd, Cter.findOne, Error!";
			res.json({success: 0, info: info});
		} else if(!cter) {
			info = "deleted! refresh Page!";
			res.json({success: 0, info: info});
		} else {
			Cter.findOne({'nome': obj.nome, 'firm': crUser.firm})
			.where('_id').ne(obj._id)
			.exec(function(err, cterSm) {
				if(err) {
					info = "bser CterUpd, Cter.findOne, Error!";
					res.json({success: 0, info: info});
				} else if(cterSm) {
					info = "已经有了此名字！";
					res.json({success: 0, info: info});
				} else {
					let _cter
					_cter = _.extend(cter, obj)
					_cter.save(function(err, objSave){
						if(err) console.log(err);
						res.json({success: 1, cter: objSave});
					})
				}
			})
		} 
	})
}

exports.bsCterUpdLogin = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	if(!obj.code) {
		info = "请输入登录帐号";
		res.json({success: 0, info: info});
	} else {
		obj.code= obj.code.replace(/\s+/g,"").toUpperCase();
		Cter.findOne({_id: obj._id, 'firm': crUser.firm})
		.exec(function(err, cter) {
			if(err) {
				info = "bser CterUpdLogin, Cter.findOne, Error!";
				res.json({success: 0, info: info});
			} else if(!cter) {
				info = "deleted! refresh Page!";
				res.json({success: 0, info: info});
			} else {
				Cter.findOne({'code': obj.code, 'firm': crUser.firm})
				.where('_id').ne(obj._id)
				.exec(function(err, cterSm) {
					if(err) {
						info = "bser CterUpdLogin, Cter.findOne, Error!";
						res.json({success: 0, info: info});
					} else if(cterSm) {
						info = "已经有了此帐号, 请重新输入！";
						res.json({success: 0, info: info});
					} else {
						let _cter
						_cter = _.extend(cter, obj)
						_cter.save(function(err, objSave){
							if(err) console.log(err);
							res.json({success: 1, cter: objSave});
						})
					}
				})
			} 
		})
	}
}

exports.bsCterNew = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj

	if(obj.nome) obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.code) {
		obj.code= obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}
	if(obj.iva) obj.iva= obj.iva.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.vip) obj.vip= parseInt(obj.vip);
	if(!isNaN(obj.vip)) obj.vip = 0;

	obj.firm = crUser.firm;
	if(!obj.nome) {
		info = "请输入客户名字";
		Err.usError(req, res, info);
	} else {
		Cter.findOne({'firm': crUser.firm, nome: obj.nome}, function(err, objSm) {
			if(err) {
				console.log(err);
				info = "bser CterNew, Cter.findOne, Error!";
				Err.usError(req, res, info);
			} else if(objSm) {
				info = "已经有了此名字, 请换个名字！";
				Err.usError(req, res, info);
			} else {
				let _cter = new Cter(obj);
				_cter.save(function(err, cterSave) {
					if(err) {
						info = "bser CterNew, _cter.save, Error!";
						Err.usError(req, res, info);
					} else {
						res.redirect('/bsCters')
					}
				})
			}
		})
	}
}


exports.bsCterIsAjax = function(req, res) {
	let crUser = req.session.crUser;
	let keytype = req.query.keytype
	let keyword = req.query.keyword
	keyword = String(keyword).replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Cter.findOne({
		'firm': crUser.firm,
		[keytype]: keyword
	})
	.exec(function(err, cter){
		if(err) {
			res.json({success: 0, info: "bsCterIsAjax, Cter.findOne, Error!"});
		} else if(cter){
			res.json({ success: 1, cter: cter})
		} else {
			res.json({success: 0})
		}
	})
}


exports.bsCtersObtAjax = function(req, res) {
	let crUser = req.session.crUser;
	let keytype = req.query.keytype
	let keyword = ' x '
	if(req.query.keyword) {
		keyword = String(req.query.keyword);
		keyword = keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}

	let keywordReg = new RegExp(keyword + '.*');
	Cter.find({
		'firm': crUser.firm,
		$or:[
			{'code': {'$in': keywordReg}},
			{'nome': {'$in': keywordReg}},
		]
	})
	.limit(5)
	.exec(function(err, cters){
		if(err) {
			res.json({success: 0, info: "bs获取客户列表时，数据库查找错误, 请联系管理员"});
		} else if(!cters){
			res.json({success: 0, info: "bs 获取客户列表错误, 请联系管理员"})
		} else {
			Cter.findOne({
				'firm': crUser.firm,
				$or: [
					{'code': keyword},
					{'nome': keyword},
				]
			})
			.exec(function(err, cter) {
				if(err) {
					console.log(err);
					res.json({success: 0, info: "bs获取客户列表时，数据库查找错误, 请联系管理员"});
				} else if(!cter) {
					res.json({ success: 1, cters: cters})
				} else {
					// console.log(cter)
					res.json({success: 2, cter: cter, cters: cters})
				}
			})
		}
	})
}