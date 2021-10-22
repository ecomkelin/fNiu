let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../config/conf');

let Pdfir = require('../../../models/material/pdfir');
let Color = require('../../../models/material/color');

let _ = require('underscore');

exports.bsPdfirs = async(req, res) => {
	try{
		let crUser = req.session.crUser;
		// let limit = 50;
		// if(req.query.limit) limit = parseInt(req.query.limit);
		let sortBy = 'upAt';
		if(req.query.sortBy) sortBy = req.query.sortBy;
		let sortVal = -1;
		if(req.query.sortVal) sortVal = req.query.sortVal;

		let symPhoto = '$ne';
		let keyPhoto = 'xxx.jpg';
		let symRcmd = '$ne';
		let keyRcmd = '20';
		if(req.query.selBy && req.query.selVal) {
			let selBy = req.query.selBy;
			let selVal = parseInt(req.query.selVal);
			if(selBy == 'isPhoto') {
				if(selVal == 0) {
					symPhoto = '$eq';
					keyPhoto = '/upload/product/1.jpg';
				} else {
					symPhoto = '$ne';
					keyPhoto = '/upload/product/1.jpg';
				}
			} else if(selBy == 'isRcmd') {
				if(selVal == 1) {
					symRcmd = '$eq';
					keyRcmd = selVal;
				} else {
					symRcmd = '$ne';
					keyRcmd = 1;
				}
			}
		}
		const param = {
			'firm': crUser.firm,
			'photo': {[symPhoto]: keyPhoto},
			'rcmd': {[symRcmd]: keyRcmd}
		}

		const pdfirs = await Pdfir.find(param)
		.sort({[sortBy]: sortVal})
		// console.log(pdfirs.length)
		return res.render('./user/bser/product/list', {title : '模特记录', crUser, pdfirs, });
	} catch(error) {
		console.log(error);
		info = "bser pdfirs, pdfir find, Error！";
		Err.usError(req, res, info);
	}
}
exports.bsPdfirsAjax = function(req, res) {
	let crUser = req.session.crUser;
	let limit = 10;
	let code = req.query.code;
	let keywordReg = new RegExp(code + '.*');
	Pdfir.find({
		'firm': crUser.firm,
		'code': {'$in': keywordReg}
	})
	.sort({'upAt': -1})
	.limit(limit)
	.exec(function(err, pdfirs) {
		if(err) {
			info = "bser pdfirs, pdfir find, Error！";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, pdfirs: pdfirs})
		}
	})
}

exports.bsPdAjaxCode = function(req, res) {
	let crUser = req.session.crUser;
	let code = req.query.code;
	Pdfir.findOne({
		'firm': crUser.firm,
		'code': code
	})
	.exec(function(err, pdfir) {
		if(err) {
			info = "bser pdfir, pdfir find, Error！";
			res.json({success: 0, info: info})
		} else if(!pdfir){
			info = "没有此号码的模特";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, pdfir: pdfir})
		}
	})
}

exports.bsPdfir = function(req, res) {
	let crUser = req.session.crUser;
	
	let id = req.params.id;

	Color.find({'firm': crUser.firm}, function(err, colors) {
		if(err) {
			info = "bser pdfir, Color find, Error！";
			Err.usError(req, res, info);
		} else {
			Pdfir.findOne({'firm': crUser.firm, '_id': id })
			.populate('colors')
			.exec(function(err, pdfir) {
				if(err) {
					info = "bser pdfir, pdfir findOne, Error！";
					Err.usError(req, res, info);
				} else if(!pdfir) {
					info = "没有找到此模特, 请刷新重试"
				} else {
					res.render('./user/bser/product/detail', {
						title : '模特记录',
						crUser,

						pdfir,
						colors,
					});
				}
			})
		}
	})
}


exports.bsPdfirAdd = function(req, res) {
	let crUser = req.session.crUser;

	res.render('./user/bser/product/add', {
		title : '添加模特',
		crUser: crUser,
	});
}


exports.bsPdfirNew = function(req, res) {
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
		Pdfir.findOne({code: obj.code, 'firm': crUser.firm})
		.exec(function(err, pdfirSame) {
			if(err) {
				console.log(err);
				info = "bsProductNew, Pdfir.findOne, Error!";
				Err.usError(req, res, info);
			} else if(pdfirSame) {
				info = "此产品号已经存在，请重新填写";
				Err.usError(req, res, info);
			} else {
				let _pdfir = new Pdfir(obj);	// 创建pdfir
				_pdfir.save(function(err, pdfirSave) {
					if(err) {
						console.log(err);
						info = "添加新产品时，数据库保存出错, 请联系管理员";
						Err.usError(req, res, info);
					} else {
						res.redirect('/bsPdfirs')
					}
				})
			}
		})
	}
}



exports.bsPdfirUpd = async(req, res, next) => {
	try {
		const crUser = req.session.crUser;
		const obj = req.body.obj;

		if(req.body.objId) obj._id = req.body.objId;
		if(obj.price) obj.price = parseFloat(obj.price);
		if(obj.cost) obj.cost = parseFloat(obj.cost);
		if(obj.stock) obj.stock = parseInt(obj.stock);
		if(obj.sales) obj.sales = parseInt(obj.sales);
		const pdfir = await Pdfir.findOne({_id: obj._id})
		if(!pdfir) return Err.usError(req, res, "数据库中没有此模特, 刷新查看");
		if(obj.stockPlus) {
			stockPlus = parseInt(obj.stockPlus)
			if(!isNaN(stockPlus)) {
				obj.stock = parseInt(pdfir.stock) + stockPlus;
			}
		}
		const _pdfir = _.extend(pdfir, obj)
		const pdfirSave = await _pdfir.save();
		return res.redirect('/bsPdfirs')
	} catch(error) {
		console.log(error);
		Err.usError(req, res, "bsProductUpd, Error");
	}
}
exports.bsPdfirPostAdd = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const pdfirId = req.body.pdfir;
		const pdfir = await Pdfir.findOne({_id: pdfirId});
		if(!pdfir) return res.redirect("/error?info=修改公司信息时，数据库保存错误，bsPdfirPostAddError");
		if(!pdfir.posts) pdfir.posts = new Array();
		// console.log(pdfir.posts)
		const photos = req.body.imgObjs;
		for(let i=0; i<photos.length; i++) {
			let post = new Object();
			post.photo = photos[i];
			post.weight = 0;
			pdfir.posts.push(post);
		}
		pdfirSave = await pdfir.save();
		return res.redirect('/bsPdfir/'+pdfirId);
	} catch(error) {
		console.log(error);
		return res.redirect("/error?info=bsPdfirPostAdd Error");
	}
}

exports.bsPdfirPostDel = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const pdfirId = req.query.pdfir;
		const id = req.params.id;

		const pdfir = await Pdfir.findOne({_id: pdfirId});
		if(!pdfir) return res.redirect("/error?info=修改公司信息时，数据库保存错误,bsPdfirPostDel,Error");
		for(let i=0; i<pdfir.posts.length; i++) {
			let post = pdfir.posts[i];
			if(post._id == id) {
				let orgPhoto = post.photo;
				MdPicture.deleteOldPhoto(orgPhoto, "/pdImgs");
				pdfir.posts.remove(post);
			}
		}
		pdfirSave = await pdfir.save();
		return res.redirect('/bsPdfir/'+pdfirId);
	} catch(error) {
		console.log(error);
		return res.redirect("/error?info=bsPdfirPostDel Error");
	}
}
exports.bsPdfirUpdFile = async(req, res) => {
	// console.log("/adPdfirUpdFile")
	try{
		const obj = req.body.obj;		// 所要更改的pdfir的id
		const pdfir = await Pdfir.findOne({'_id': obj._id})
		if(!pdfir) return res.redirect("/error?info=没有找到此商品, 请刷新重试");
		let _object = _.extend(pdfir, obj)
		const pdfirSave = _object.save();
		return res.redirect("/bsPdfir/"+obj._id);
	} catch(error) {
		console.log(error);
		return res.redirect("/error?info=adPdfirUpdFile Error");
	}
}


exports.bsProdFilter = function(req, res, next) {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Pdfir.findOne({_id: id, 'firm': crUser.firm})
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
	.exec(function(err, pdfir) {
		if(err) {
			console.log(err);
			info = "查看产品信息时，数据库查找出错, 请联系管理员";
			Err.usError(req, res, info);
		} else if(!pdfir) {
			info = "此产品已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(pdfir.pdsezs[0])
			req.body.pdfir = pdfir;
			next();
		}
	})
}





exports.bsPdfirDel = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const id = req.params.id;
		const pdfir = await Pdfir.findOne({_id: id, 'firm': crUser.firm});
		if(!pdfir) return res.redirect("/error?info=bsPdfirDel !pdfir");
		const orgPhoto = pdfir.photo;
		MdPicture.deleteOldPhoto(orgPhoto, Conf.photoPath.proPhoto);
		const orgPosts = pdfir.posts;
		for(let i=0; i<orgPosts.length; i++) {
			let orgPost = orgPosts[i];
			if(orgPost && orgPost.photo) {
				MdPicture.deleteOldPhoto(orgPost.photo, '/pdImgs');
			}
		}
		Pdfir.deleteOne({_id: pdfir._id}, function(err, objRm) {
			if(err) {
				info = "bsPdfirDel, Pdfir.findOne, Error!";
				Err.usError(req, res, info);
			} else {
				res.redirect('/bsPdfirs');
			}
		})
	} catch(error) {
		console.log(error);
		return res.redirect("/error?info=bsPdfirDel Error");
	}
}











exports.bsPdColorAjax = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let colorId = req.query.colorId;
	let sym = parseInt(req.query.sym);
	Pdfir.findOne({_id: id, firm: crUser.firm}, {colors: 1})
	.exec(function(err, pdfir) {
		if(err) {
			console.log(err);
			info = "bser AjaxDelColor, pdfir findOne, Error！";
			res.json({success: 0, info: info})
		} else if(!pdfir) {
			info = "没有找到此模特";
			res.json({success: 0, info: info})
		} else {
			// console.log(pdfir)
			if(sym == 0) {
				var i=0
				for(; i<pdfir.colors.length; i++) {
					if(colorId == pdfir.colors[i]) break;
				}
				if(i == pdfir.colors.length) {
					info = "请刷新重试";
					res.json({success: 0, info: info})
				} else {
					pdfir.colors.remove(colorId)

					pdfir.save(function(err, pdSave) {
						if(err) {
							console.log(err);
							info = "bser AjaxDelColor, pdfir save, Error！";
							res.json({success: 0, info: info})
						} else {
							res.json({success: 1, sym})
						}
					})
				}
			} else if(sym == 1) {
				var i=0
				for(; i<pdfir.colors.length; i++) {
					if(colorId == pdfir.colors[i]) break;
				}
				if(i != pdfir.colors.length) {
					info = "不能添加相同颜色";
					res.json({success: 0, info: info})
				} else {
					pdfir.colors.unshift(colorId);
					pdfir.save(function(err, pdSave) {
						if(err) {
							console.log(err);
							info = "bser AjaxNewColor, pdfir save, Error！";
							res.json({success: 0, info: info})
						} else {
							res.json({success: 1, sym})
						}
					})
				}
			} else {
				info = "操作错误";
				res.json({success: 0, info: info})
			}
		}
	})
}

exports.bsPdAjaxNewSize = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let size = req.query.size;

	Pdfir.findOne({_id: id, firm: crUser.firm})
	.exec(function(err, pdfir) {
		if(err) {
			console.log(err);
			info = "bser AjaxNewColor, pdfir findOne, Error！";
			res.json({success: 0, info: info})
		} else if(!pdfir) {
			info = "没有找到此模特";
			res.json({success: 0, info: info})
		} else {
			let newSize = null;
			if(!pdfir.sizes || pdfir.sizes.length == 0) {
				newSize = Conf.sizes[10]
				pdfir.sizes.push(newSize);
			} else {
				if(size == "l"){
					let sizel = pdfir.sizes[0]
					let sz
					for(sz in Conf.sizes) {
						if(sizel == Conf.sizes[sz]){
							break;
						}
					}
					sz = parseInt(sz) - 1
					newSize = Conf.sizes[sz]
					if(newSize) pdfir.sizes.unshift(newSize);
				} else {
					let sizer = pdfir.sizes[pdfir.sizes.length-1]
					let sz
					for(sz in Conf.sizes) {
						if(sizer == Conf.sizes[sz]){
							break;
						}
					}
					sz = parseInt(sz) + 1
					newSize = Conf.sizes[sz]
					if(newSize) pdfir.sizes.push(newSize);
				}
			}
			pdfir.save(function(err, pdSave) {
				if(err) {
					console.log(err);
					info = "bser AjaxNewColor, pdfir save, Error！";
					res.json({success: 0, info: info})
				} else {
					res.json({success: 1, pdfir, newSize})
				}
			})
			// console.log(pdfir)

		}
	})
}
exports.bsPdAjaxDelSize = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let size = req.query.size;

	Pdfir.findOne({_id: id, firm: crUser.firm})
	.exec(function(err, pdfir) {
		if(err) {
			console.log(err);
			info = "bser AjaxDelColor, pdfir findOne, Error！";
			res.json({success: 0, info: info})
		} else if(!pdfir) {
			info = "没有找到此模特";
			res.json({success: 0, info: info})
		} else {
			let delSize = null
			if(size == "l"){
				delSize = pdfir.sizes[0]
				pdfir.sizes.shift();
			} else {
				delSize = pdfir.sizes[pdfir.sizes.length-1]
				pdfir.sizes.pop();
			}

			pdfir.save(function(err, pdSave) {
				if(err) {
					console.log(err);
					info = "bser AjaxNewColor, pdfir save, Error！";
					res.json({success: 0, info: info})
				} else {
					res.json({success: 1, pdfir, delSize})
				}
			})
			// console.log(pdfir)

		}
	})
}