let Err = require('../../../aaIndex/err');
let Conf = require('../../../../config/conf');
let SaveOrderPre = require('../../../../middle/saveOrderPre');

let _ = require('underscore');
let moment = require('moment');

let User = require('../../../../models/login/user');

let Cter = require('../../../../models/client/cter');
let Order = require('../../../../models/client/order');
let Ordfir = require('../../../../models/client/ordfir');

let Pdfir = require('../../../../models/material/pdfir');


exports.bsOrders = function(req, res) {
	let crUser = req.session.crUser;
	User.find({'firm': crUser.firm, 'role': [1, 5]}, function(err, users) {
		if(err) {
			console.log(err);
			info = "bser order his, User.find, Error";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bser/order/orders', {
				title : '订单管理',
				crUser: crUser,

				users: users
			});
		}
	})
}
exports.bsOrdersAjax = function(req, res) {
	let crUser = req.session.crUser;

	let symAtFm = "$gte";
	let symAtTo = "$lte";
	let condAtFm = new Date(new Date().setHours(0, 0, 0, 0));
	let condAtTo = new Date(new Date().setHours(23, 59, 59, 999))
	if(req.query.atFm && req.query.atFm.length == 10){
		condAtFm = new Date(req.query.atFm).setHours(0,0,0,0);
	}
	if(req.query.atTo && req.query.atTo.length == 10){
		condAtTo = new Date(req.query.atTo).setHours(23,59,59,999);
	}

	Order.find({'firm': crUser.firm,
		'ctAt': {[symAtFm]: condAtFm, [symAtTo]: condAtTo}
	})
	.populate('cter', 'nome')
	.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
	.sort({'ctAt': -1})
	.exec(function(err, orders) {
		if(err) {
			console.log(err);
			info = "bser orders, Order.find, Error";
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, orders: orders})
		}
	})
}


exports.bsOrderTicketing = async(req, res) => {
	try {
		let crUser = req.session.crUser;
		let orderId = req.query.orderId;
		let newTicket = parseInt(req.query.newTicket);
		// console.log(orderId)
		if(isNaN(newTicket)) return res.json({success: 0, info: "Error! bsOrderTicketing ticketing isNaN"});
		const order = await Order.findOne({_id: orderId});
		if(!order) return res.json({success: 0, info: "系统没有找到此订单, 请刷新页面重试"});
		order.ticketing = newTicket;
		const objSave = await order.save();
		if(!objSave) return res.json({success: 0, info: "保存失败"});
		return res.json({success: 1, info: "已经更改"});
	} catch(error) {
		console.log(error);
		res.json({success: 0, info: "bsOrderTicketing Error"});
	}
}
exports.bsOrderStamping = function(req, res) {
	let crUser = req.session.crUser;
	let orderId = req.query.orderId;
	let newStamp = parseInt(req.query.newStamp);
	// console.log(orderId)
	if(isNaN(newStamp)) {
		res.json({success: 0, info: "Error! bsOrderStamping stamping isNaN"});
	} else {
		Order.findOne({_id: orderId}, function(err, order){
			if(err) console.log(err);
			if(order){
				order.stamping = newStamp;
				order.save(function(err,objSave) {
					if(err) console.log(err);
					// console.log(objSave)
					res.json({success: 1, info: "已经更改"});
				})
			} else {
				res.json({success: 0, info: "已被删除，按F5刷新页面查看"});
			}
		})
	}
}

exports.bsOrdHis = function(req, res) {
	let crUser = req.session.crUser;

	let symAtFm = "$gte";
	let symAtTo = "$lte";
	let condAtTo = new Date(new Date().setHours(23, 59, 59, 0))
	let condAtFm = (condAtTo - Conf.hisDays*24*60*60*1000)
	if(req.query.atFm && req.query.atFm.length == 10){
		symAtFm = "$gte";   // $ ne eq gte gt lte lt
		condAtFm = new Date(req.query.atFm).setHours(0,0,0,0);
	}
	if(req.query.atTo && req.query.atTo.length == 10){
		symAtTo = "$lte";
		condAtTo = new Date(req.query.atTo).setHours(23,59,59,0);
	}

	/* ---------- 排序 ------------- */
	let sortCond = "ctAt";
	let sortVal = -1;
	if(req.query.sortCond == "fnAt"){
		sortCond = "fnAt";
	}
	if(req.query.sortVal == 1){
		sortVal = 1;
	}
	/* ---------- 排序 ------------- */
	
	Order.find({
		'firm': crUser.firm,
		'status': 10,
		'ctAt': {[symAtFm]: condAtFm, [symAtTo]: condAtTo}
	})
	.populate('cter', 'nome')
	.populate({path: 'ordfirs', populate: [
		{path: 'pdfir'},
		{path: 'ordsecs', populate: [
			{path: 'pdsec'},
			{path: 'ordthds', populate: {path: 'pdthd'}},
		]}
	]})
	.sort({"status": 1, [sortCond]: sortVal})
	.exec(function(err, orders) {
		if(err) {
			info = "bser order his, User.find, Error";
			Err.usError(req, res, info);
		} else {
			// console.log(orders.length)
			res.render('./user/bser/order/order10', {
				title : '订单记录',
				crUser: crUser,
				orders: orders,

				atFm  : condAtFm,
				atTo  : condAtTo,
				sortCond: sortCond,
				sortVal : sortVal,
			});
		}
	})
}



exports.bsOrderNew = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	let id = req.body.id;
	let cterId = null;
	if(obj.cter) cterId = obj.cter;
	obj.imp = parseFloat(obj.imp);
	if(isNaN(obj.imp)) {
		console.log(err)
		info = "注意, 总价错误!";
		res.json({success: 0, info: info});
	} else {
		let firs = new Array();;
		if(obj.firs) firs = obj.firs;
		if(id) {	// 更新
			Order.findOne({_id: id})
			.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
			.exec(function(err, order) {
				if(err) {
					console.log(err)
					info = "bser OrderNew, Pdfir.findOne, Error!";
					res.json({success: 0, info: info});
				} else {
					let _order = _.extend(order, obj);
					_order.cter = cterId;
					fkBsOrdUpd_setOrdfir(req, res, _order, firs)
				}
			})
		} else {	// 新订单（包括 复制）
			Order.findOne({firm: crUser.firm})	// 为了给新订单赋值密码
			.sort({'ctAt': -1})
			.exec(function(err, preOrder) {
				if(err) {
					console.log(err)
					info = "bser OrderNew, Pdfir.findOne, Error!";
					res.json({success: 0, info: info});
				} else {
					let code = null;
					if(preOrder) {
						code = preOrder.code;
					}
					obj.code = fcBsOrderGetCode(code);
					obj.firm = crUser.firm;
					obj.creater = crUser._id;
					let _order = new Order(obj)
					_order.cter = cterId;
					fkBsOrdNew_setOrdfir(req, res, _order, firs)
				}
			})
		}
	}
}

let fkBsOrdUpd_setOrdfir = function(req, res, order, firs) {
	let newfirs  = new Array();
	let updfirs  = new Array();
	let delfirs = new Array();

	let orgFirs = order.ordfirs;
	for(let i=0; i<orgFirs.length; i++) {
		let orgFir = orgFirs[i];
		let fir = null;
		for(j=0; j<firs.length; j++) {
			if(orgFir.pdfir._id == firs[j].pdfir) {
				fir = firs[j];
				break;
			}
		}
		if(fir) {
			// if(orgFir.price != parseFloat(fir.price) || orgFir.quot != parseInt(fir.quot)) {
				orgFir.price = parseFloat(fir.price);
				orgFir.quot = parseInt(fir.quot);
				orgFir.cter = order.cter;
				updfirs.push(orgFir);
			// }
		} else {
			order.ordfirs.remove(orgFir);
			delfirs.push(orgFir);
		}
	}
	for(let i=0; i<firs.length; i++) {
		let fir = firs[i];
		let orgFir = null;
		for(let j=0; j<orgFirs.length; j++) {
			if(orgFirs[j].pdfir._id == fir.pdfir) {
				orgFir = orgFirs[j];
				break;
			}
		}
		if(!orgFir) {
			let objfir = new Object();
			objfir.firm = order.firm;
			objfir.creater = order.creater;
			objfir.cter = order.cter;
			objfir.order = order._id;
			objfir.pdfir = fir.pdfir;
			objfir.price = parseFloat(fir.price);
			objfir.quot = parseInt(fir.quot);
			objfir.orgQuot = 0;
			if(isNaN(objfir.price) || isNaN(objfir.quot)) break;
			let _ordfir = new Ordfir(objfir);
			order.ordfirs.push(_ordfir._id)
			newfirs.push(_ordfir)
		}
	}
	bsOrd_updDBs(req, res, newfirs, order, updfirs, 0);
	fkBsOrder_unRelPds(delfirs, 0);
}
let bsOrd_updDBs = function(req, res, newfirs, order, updfirs, n) {
	if(n == updfirs.length) {
		bsOrd_newDBs(req, res, order, newfirs, 0, true)
	} else {
		let updfir = updfirs[n];
		Pdfir.findOne({_id: updfir.pdfir}, function(err, pdfir) {
			if(err) console.log(err);
			let pdquot = updfir.quot - updfir.orgQuot;
			pdfir.stock -= pdquot;
			pdfir.sales += pdquot;
			pdfir.save(function(err, pdSave) {
				if(err) console.log(err);
				// console.log('ordfir: '+updfir.cter)
				updfir.save(function(err, firSave) {
					if(err) console.log(err);
					bsOrd_updDBs(req, res, newfirs, order, updfirs, n+1)
				})
			})
		})
	}
}

let fkBsOrdNew_setOrdfir = function(req, res, order, firs) {
	let newfirs  = new Array();
	let i=0
	for(; i<firs.length; i++) {
		let fir = firs[i];
		let objfir = new Object();
		objfir.firm = order.firm;
		objfir.creater = order.creater;
		objfir.cter = order.cter;
		objfir.order = order._id;
		objfir.pdfir = fir.pdfir;
		objfir.price = parseFloat(fir.price);
		objfir.quot = parseInt(fir.quot);
		objfir.orgQuot = 0;
		if(isNaN(objfir.price) || isNaN(objfir.quot)) break;
		let _ordfir = new Ordfir(objfir);
		order.ordfirs.push(_ordfir._id)
		newfirs.push(_ordfir)
	}
	if(i != firs.length) {
		info = "注意, 产品价格或数量错误! 请检查";
		res.json({success: 0, info: info});
	} else {
		bsOrd_newDBs(req, res, order, newfirs, 0, false);
	}
}
let bsOrd_newDBs = function(req, res, order, newfirs, n, isUpd) {
	if(n == newfirs.length) {
		// console.log(order.cter);
		order.save(function(err, orderSv) {
			if(err) {
				info = "bser ord_saveDBs, Order.save, Error!";console.log(err);
				res.json({success: 0, info: info});
			} else {
				Order.findOne({_id: order._id})
				.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
				.populate('cter')
				.exec(function(err, orderFn) {
					if(err) {
						info = "bser order New, Order.findOne, Error!";console.log(err);
						res.json({success: 0, info: info});
					} else {
						res.json({success: 1, order: orderFn, isUpd: isUpd});
					}
				})
			}
		})
	} else {
		let newfir = newfirs[n];
		Pdfir.findOne({_id: newfir.pdfir}, function(err, pdfir) {
			if(err) console.log(err);
			let pdquot = newfir.quot - newfir.orgQuot;
			pdfir.stock -= pdquot;
			pdfir.sales += pdquot;
			pdfir.ordfirs.unshift(newfir._id);
			pdfir.save(function(err, pdSave) {
				if(err) console.log(err);
				newfir.save(function(err, firSave) {
					if(err) console.log(err);
					bsOrd_newDBs(req, res, order, newfirs, n+1, isUpd)
				})
			})
		})
	}
}




exports.bsOrderDel = function(req, res) {
	let crUser = req.session.crUser;
	let orderId = req.query.orderId
	Order.findOne({_id: orderId, 'firm': crUser.firm})
	.populate({path: 'ordfirs', populate:{path: 'pdfir'}})
	.populate('cter')
	.exec(function(err, order) {
		if(err) {
			console.log(err);
			info = "bsOrderDel, Order.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!order) {
			info = "订单已经不存在, 请刷新查看!";
			Err.usError(req, res, info);
		} else {
			fkBsOrder_unRelPds(order.ordfirs, 0) // 删除订单时 pd和ord解除关联
			Order.deleteOne({_id: orderId}, function(err, orderRm) {
				if(err) {
					info = "bsOrderDel, Order.deleteOne, Error!";
					res.json({success: 0, info: info})
				} else {
					res.json({success: 1})
				}
			})
		}
	})
}
// 删除订单时 pd和ord解除关联, 并删除ordfir
let fkBsOrder_unRelPds = function(ordfirs, n) {
	if(n == ordfirs.length){
		Ordfir.deleteMany({'_id': {'$in': ordfirs}}, function(err, firRm) {
			if(err) console.log(err);
		})
		return;
	}
	let ordfir = ordfirs[n];
	let pdfir = ordfir.pdfir;
	if(!isNaN(ordfir.quot)) {
		pdfir.stock += ordfir.quot;
		pdfir.sales -= ordfir.quot;
	}
	pdfir.ordfirs.remove(ordfir);
	pdfir.save(function(err, pdSave) {
		if(err) console.log(err);
		fkBsOrder_unRelPds(ordfirs, n+1)
	})
}







let fcBsOrderGetCode = function(code) {
	let today =parseInt(moment(Date.now()).format('YYMMDD')) // 计算今天的日期
	let preOrdDay = 0, preOrdNum = 0;

	if(code) {
		preOrdDay = parseInt(code.slice(0,6))
		preOrdNum = parseInt(code.slice(6,10))
	}

	if(today == preOrdDay) {	// 判断上个订单的日期是否是今天
		preOrdNum = preOrdNum+1
	} else {					// 如果不是则从1开始
		preOrdNum = 1
	}
	for(let len = (preOrdNum + "").length; len < 4; len = preOrdNum.length) { // 序列号补0
		preOrdNum = "0" + preOrdNum;
	}
	
	return String(today) + String(preOrdNum);
}

exports.bsOrdChangeSts = function(req, res) {
	let crUser = req.session.crUser;
	let orderId = req.body.orderId;
	let target = req.body.target;

	Order.findOne({_id: orderId, 'firm': crUser.firm})
	.populate({path: 'ordfirs', populate: [
		{path: 'pdfir'},
		{path: 'ordsecs', populate: {path: 'ordthds', populate: {path: 'pdthd'}}},
	]})
	.populate('cter')
	.exec(function(err, order) {
		let info = 'T';
		if(err) {
			console.log(err);
			info = "bsOrderNew, Order.findOne, Error!";
		} else if(!order) {
			info = "数据错误，请重试";
		} else {
			if(target == "bsOrderFinish") { // 订单状态从0变为10的时候 解除 pd与ord的联系
				if(order.status != 0) {
					info = "order 0->10 页面已过期, 不可重复操作, 请刷新页面查看!"
				} else {
					order.status = 10;
					order.fnAt = Date.now();
					SaveOrderPre.pdRelOrderFinish(order, 'bsOrderFinish')
				}
			} else if(target == "bsOrderBack") { // 订单状态从10变为0的时候 链接 pd与ord的联系
				if(order.status != 10) {
					info = "order 10->0 页面已过期, 不可重复操作, 请刷新页面查看!"
				} else {
					order.status = 0;
					order.fnAt = null;
					SaveOrderPre.pdRelOrderBack(order, 'bsOrderBack');
				}
			} else {
				info = "操作错误，请重试"
			}
			if(info == 'T') {
				order.save(function(err, orderSv) {
					if(err) {
						info = "bsOrdChangeSts, Order.save, Error!";console.log(err);
						Err.usError(req, res, info);
					} else {
						if(target == "bsMacCancelOrd") {
							res.redirect('/bsMacs')
						} else if(target == "bsOrderBack") {
							res.redirect('/bsOrdHis')
						} else {
							res.redirect('/bsOrds')
						}
					}
				})
			} else {
				Err.usError(req, res, info);
			}
		}
	})
}