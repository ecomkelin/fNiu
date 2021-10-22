let Err = require('../aaIndex/err');

let Pdfir = require('../../models/material/pdfir');
let Orc = require('../../models/client/orc');
let Orcpd = require('../../models/client/orcpd');

exports.order = function(req, res) {
	let crCter = req.session.crCter;
	let id = req.params.id;

	Orc.findOne({_id: id, firm: crCter.firm})
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
			res.render('./cter/order/detail', {
				title : '订单信息',
				crCter,
				orc
			});
		}
	})
}

exports.ctOrcpdNewAjax = function(req, res) {
	let crCter = req.session.crCter;
	let obj = req.body.obj;
	obj.firm = crCter.firm;
	obj.cter = crCter._id;
	Orc.findOne({_id: obj.orc, firm: crCter.firm}, function(err, orc) {
		if(err) {
			console.log(err);
			info = "cter Orc NewAjax, Orc.findOne, Error!"
			res.json({success: 0, info})
		} else if(!orc) {
			info = "请刷新重试, !orc, Please reflesh!"
			res.json({success: 0, info})
		} else {
			Pdfir.findOne({_id: obj.pdfir, firm: crCter.firm}, function(err, pdfir) {
				if(err) {
					console.log(err);
					info = "cter Orc NewAjax, Pdfir.findOne, Error!"
					res.json({success: 0, info})
				} else if(!pdfir) {
					info = "请刷新重试, !pdfir, Please reflesh!"
					res.json({success: 0, info})
				} else if(parseInt(pdfir.price) != parseInt(obj.price)) {
					info = "操作错误, 不能私自修改"
					res.json({success: 0, info})
				} else {
					// console.log(obj)
					obj.quot = 0;
					for(let i=0; i<obj.colors.length; i++) {
						obj.colors[i].cquot = 0;
						for(let j=0; j<obj.colors[i].sizes.length; j++) {
							let quot = parseInt(obj.colors[i].sizes[j].quot)
							if(!isNaN(quot)) {
								obj.colors[i].cquot += quot;
							}
						}
						obj.quot += obj.colors[i].cquot;
					}
					obj.sizes = pdfir.sizes;

					let _orcpd = new Orcpd(obj);
					orc.imp += _orcpd.price * _orcpd.quot;
					orc.orcpds.unshift(_orcpd._id);
					orc.save(function(err, orcSave) {
						if(err) {
							console.log(err);
							info = "cter Orc NewAjax, orc.save, Error!"
							res.json({success: 0, info})
						} else {
							_orcpd.save(function(err, orcpdSave) {
								if(err) {
									console.log(err);
									info = "cter Orc NewAjax, _orcpd.save, Error!"
									res.json({success: 0, info})
								} else {
									res.json({success: 1})
								}
							})
						}
					})
				}
			})
		}
	})
}

exports.ctOrcpdDelAjax = function(req, res) {
	let crCter = req.session.crCter;
	let orcpdId = req.query.orcpdId;
	// console.log(orcpdId)
	Orcpd.findOne({_id: orcpdId, firm: crCter.firm})
	.populate('orc')
	.exec(function(err, orcpd) {
		if(err) {
			console.log(err);
			info = "cter Orc DelAjax, Orcpd.findOne, Error!"
			res.json({success: 0, info})
		} else if(!orcpd) {
			info = "cter Orc DelAjax, 请刷新重试!"
			res.json({success: 0, info})
		} else {
			let orc = orcpd.orc;
			orc.orcpds.remove(orcpdId);
			orc.imp -= orcpd.price * orcpd.quot;
			orc.save(function(err, orcSave) {
				if(err) {
					console.log(err);
					info = "cter Orc DelAjax, orc.save, Error!"
					res.json({success: 0, info})
				} else {
					// console.log(orcSave)
					Orcpd.deleteOne({_id: orcpdId, firm: crCter.firm}, function(err, orcpdDel) {
						if(err) {
							console.log(err);
							info = "cter Orc DelAjax, Orcpd.deleteOne, Error!"
							res.json({success: 0, info})
						} else {
							res.json({success: 1, imp: orcSave.imp})
						}
					})
				}
			})
		}
	})
}

exports.ctOrcpdUpdAjax = function(req, res) {
	let crCter = req.session.crCter;
	let orcpdId = req.query.orcpdId;
	let colorcode = req.query.colorcode;
	let size = req.query.size;
	let quot = parseInt(req.query.quot);
	// console.log(orcpdId)
	if(isNaN(quot)) {
		info = "cter OrcpdUpdAjax, 请填写正确的数字"
		res.json({success: 0, info})
	} else {
		Orcpd.findOne({_id: orcpdId, firm: crCter.firm})
		.populate('orc')
		.exec(function(err, orcpd) {
			if(err) {
				console.log(err);
				info = "cter Orc DelAjax, Orcpd.findOne, Error!"
				res.json({success: 0, info})
			} else if(!orcpd) {
				info = "cter OrcpdUpdAjax, 请刷新重试"
				res.json({success: 0, info})
			} else {
				let orgQuot = orcpd.quot;
				orcpd.quot = 0;
				for(let i=0; i<orcpd.colors.length; i++) {
					orcpd.colors[i].cquot = 0;
					for(let j=0; j<orcpd.colors[i].sizes.length; j++) {
						if(orcpd.colors[i].colorcode == colorcode && orcpd.colors[i].sizes[j].size == size) {
							orcpd.colors[i].sizes[j].quot  = quot;
						}
						orcpd.colors[i].cquot += orcpd.colors[i].sizes[j].quot;
					}
					orcpd.quot += orcpd.colors[i].cquot;
				}
				let orc = orcpd.orc;
				orc.imp += (orcpd.quot - orgQuot) * orcpd.price
				orc.save(function(err, orcSave) {
					if(err) {
						console.log(err);
						info = "cter Orc DelAjax, orc.save, Error!"
						res.json({success: 0, info})
					} else {
						orcpd.save(function(err, orcpdSave) {
							if(err) {
								console.log(err);
								info = "cter Orc DelAjax, orcpd.save, Error!"
								res.json({success: 0, info})
							} else {
								res.json({success: 1, orcpd: orcpdSave, imp: orcSave.imp})
							}
						})
					}
				})
			}
		})
	}
}

exports.ctOrcSubAjax = function(req, res) {
	let crCter = req.session.crCter;
	let orcId = req.query.orcId;

	Orc.findOne({_id: orcId, firm: crCter.firm}, {'status': 1})
	.exec(function(err, orc) {
		if(err) {
			console.log(err);
			info = "cter Orc SubAjax, Orc.findOne, Error!"
			res.json({success: 0, info})
		} else if(!orc) {
			info = "cter OrcSubAjax, 请刷新重试"
			res.json({success: 0, info})
		} else {
			Orc.findOne({
				'firm' : crCter.firm,
				'status': 5
			})	// 为了给新订单赋值单号
			.sort({'ctAt': -1})
			.exec(function(err, preOrc) {
				if(err) {
					console.log(err)
					info = "cter OrcSubAjax, Orc.findOne, Error!";
					res.json({success: 0, info: info});
				} else {
					let code = null;
					if(preOrc) {
						code = preOrc.code;
					}
					orc.status = 5;
					orc.code = ctOrcGetCode(code);
					orc.ctAt = Date.now();
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
	})
}

let moment = require('moment');
let ctOrcGetCode = function(code) {
	let today =parseInt(moment(Date.now()).format('YYMMDD')) // 计算今天的日期
	let preOrdDay = 0, preOrdNum = 0;

	if(code) {
		preOrdDay = parseInt(code.slice(0,6))
		preOrdNum = parseInt(code.slice(8,12))
	}

	if(today == preOrdDay) {	// 判断上个订单的日期是否是今天
		preOrdNum = preOrdNum+1
	} else {					// 如果不是则从1开始
		preOrdNum = 1
	}
	for(let len = (preOrdNum + "").length; len < 4; len = preOrdNum.length) { // 序列号补0
		preOrdNum = "0" + preOrdNum;
	}
	
	return String(today) + 'ct' + String(preOrdNum);
}