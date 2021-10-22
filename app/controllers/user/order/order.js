let Err = require('../../aaIndex/err');
let Conf = require('../../../config/conf');

let _ = require('underscore');
let moment = require('moment');

let User = require('../../../models/login/user');

let Cter = require('../../../models/client/cter');
let Order = require('../../../models/client/order');
let Ordfir = require('../../../models/client/ordfir');

let Pdfir = require('../../../models/material/pdfir');

exports.order = function(req, res) {
	let crUser = req.session.crUser;
	res.render('./user/order/order', {
		title: '系统',
		crUser : crUser,
	})
}

exports.ordAddCter = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	obj.vip = parseInt(obj.vip);
	obj.firm = crUser.firm;
	obj.creater = crUser._id;

	Cter.findOne({nome: obj.nome, 'firm': crUser.firm}, function(err, cter) {
		if(err) {
			console.log(err);
			info = 'ord Add Cter, Cter findOne, Error!';
			res.json({success: 0, info: info})
		} else if(cter) {
			// console.log(cter)
			res.json({success: 1, cter: cter})
		} else {
			let _cter = new Cter(obj)
			_cter.save(function(err, cter) {
				if(err) {
					console.log(err);
					info = 'ord Add Cter, Cter save, Error!';
					res.json({success: 0, info: info})
				} else {
					// console.log(cter)
					res.json({success: 1, cter: cter})
				}
			})
		}
	})
}
exports.ordAddPdfir = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.code = obj.code.replace(/\s+/g,"").toUpperCase();
	obj.price = parseFloat(obj.price);
	if(obj.cost) obj.cost = parseFloat(obj.cost);
	if(obj.stock) obj.stock = parseInt(obj.stock);
	obj.firm = crUser.firm;
	obj.creater = crUser._id;

	Pdfir.findOne({code: obj.code, 'firm': crUser.firm}, function(err, pdfir) {
		if(err) {
			console.log(err);
			info = 'ord Add Pdfir, Pdfir findOne, Error!';
			res.json({success: 0, info: info})
		} else if(pdfir) {
			// console.log(pdfir)
			res.json({success: 1, pdfir: pdfir})
		} else {
			let _pdfir = new Pdfir(obj)
			_pdfir.save(function(err, pdfir) {
				if(err) {
					console.log(err);
					info = 'ord Add Pdfir, Pdfir save, Error!';
					res.json({success: 0, info: info})
				} else {
					// console.log(pdfir)
					res.json({success: 1, pdfir: pdfir})
				}
			})
		}
	})
}

let fs = require('fs');
let path = require('path');
exports.OrderExcel = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const id = req.params.id;
		const order = await Order.findOne({'firm': crUser.firm, _id: id })
			.populate('cter', 'nome')
			.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
		if(!order) return res.json({success: 0, info: '没有找到此订单, 请重试'});
		if(!order.ordfirs) return res.json({success: 0, info: '没有找到此订单, 请重试'});

		let xl = require('excel4node');
		let wb = new xl.Workbook({
			defaultFont: {
				size: 12,
				color: '333333'
			},
			dateFormat: 'yyyy-mm-dd hh:mm:ss'
		});
		let ws = wb.addWorksheet('Sheet 1');
		ws.column(1).setWidth(15);
		ws.column(2).setWidth(20);
		ws.column(3).setWidth(10);
		ws.column(4).setWidth(5);
		ws.column(5).setWidth(10);

		let row = 1;
		// header
		ws.cell(row,1).string('Codice');
		ws.cell(row,2).string('Nome');
		ws.cell(row,3).string('Pr.');
		ws.cell(row,4).string('PZ.');
		ws.cell(row,5).string('TOT.');
		row++;
		let total = 0;
		for(let i=0; i<order.ordfirs.length; i++){
			const object = order.ordfirs[i];
			const pdfir = object.pdfir;
			if(pdfir && pdfir.code) ws.cell(row, 1).string(String(pdfir.code));
			if(pdfir && pdfir.nome) ws.cell(row, 2).string(String(pdfir.nome));
			if(object.price) ws.cell(row, 3).string(String(object.price));
			if(object.quot) ws.cell(row, 4).string(String(object.quot));
			if(object.quot && object.price) {
				let tot = object.quot * object.price;
				if(!isNaN(tot)) {
					total+=tot;
				}
				ws.cell(row, 5).string(String(tot));
			}
			if(pdfir && pdfir.photo) {
				const image = fs.readFileSync(path.resolve(__dirname, '../../../../public/'+pdfir.photo));
				ws.addImage({
					image,
					type: 'picture',
					position: {
						type: 'oneCellAnchor',
						from: {
							col: 6,
							colOff: "1mm",
							row: row,
							rowOff: "1mm",
						},
						to: {
							col: 7,
							colOff: "6mm",
							row: row,
							rowOff: "6mm",
						},
					},
				});
			}
			row++
		}
		ws.cell(row, 1).string('Total:');
		ws.cell(row, 5).string(String(total));
		row++;
		if(total != order.imp) {
			ws.cell(row, 1).string('Imp:');
			ws.cell(row, 5).string(String(order.imp));
		}

		let excelName = '';
		if(order.cter) {
			excelName = (order.cter.nome ? order.cter.nome: order.cter.code)+'_'+order.code;
		} else {
			excelName = order.code;
		}
		excelName = 'Order-'+excelName+'.xlsx';
		return wb.write(excelName, res);

	} catch(e) {
		console.log(e)
		return res.json({success: 0, info: 'OrderExcel Error'})
	}

}


exports.getOrderAjax = function(req, res) {
	let crUser = req.session.crUser;
	let orderId = req.query.orderId
	Order.findOne({
		'firm': crUser.firm,
		_id: orderId
	})
	.populate('cter', 'nome')
	.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
	.sort({'ctAt': -1})
	.exec(function(err, order) {
		if(err) {
			info = "getOrderAjax, Order.findOne, Error";
			res.json({success: 0, info: info})
		} else if(!order) {
			info = '没有找到此订单, 请重试'
			res.json({success: 0, info: info})
		} else if(!order.ordfirs) {
			info = '没有找到此订单, 请重试'
			res.json({success: 0, info: info})
		} else {
			res.json({success: 1, order: order})
		}
	})
}








exports.getOrders = function(req, res) {
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

	Order.find({
		'firm': crUser.firm,
		'creater': crUser._id,
		'status': 0,
		'ctAt': {[symAtFm]: condAtFm, [symAtTo]: condAtTo}
	})
	.populate('cter', 'nome')
	.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
	.sort({'ctAt': -1})
	.exec(function(err, orders) {
		if(err) {
			info = "orders, User.find, Error";
			res.json({success: 0, info: info})
		} else {
			// console.log(orders)
			res.json({success: 1, orders: orders})
		}
	})
}

exports.bsOrdersMonth = function(req, res) {
	let crUser = req.session.crUser;

	ctAt = Date.parse(crUser.ctAt);
	let months = new Array();

	let now = new Date();
	let tMonth = now.getMonth();
	let tyear = now.getFullYear();
	let tFirst = new Date(tyear, tMonth, 1);
	let timestamps = tFirst.setHours(0, 0, 0, 0);
	let timestampf = now.setHours(23, 59, 59, 999);
	// console.log(timestamps)
	// console.log(timestampf)

	let month = new Object();
	month.key = String(tyear).slice(2,4)+'年'+(tMonth+1)+'月';
	month.vals = timestamps
	month.valf = timestampf

	months.push(month)
	for(let i=1; i< 24; i++) {
		tMonth = tMonth-1;
		if(tMonth < 0) {
			tyear = tyear -1;
			tMonth = 11;
		}
		tFirst = new Date(tyear, tMonth, 1);
		timestamps = tFirst.setHours(0, 0, 0, 0);
		tFirst.setMonth(tFirst.getMonth() + 1);
		tFirst.setDate(tFirst.getDate() - 1)
		timestampf = tFirst.setHours(23, 59, 59, 999);
		months[i] = new Object();
		months[i].key = String(tyear).slice(2,4)+'年'+(tMonth+1)+'月';
		months[i].vals = timestamps
		months[i].valf = timestampf
		if(timestampf < ctAt) break;
	}


	User.find({'firm': crUser.firm})
	.where('role').ne(3)
	.exec(function(err, users) {
		if(err) {
			info = "bsOrdersMonth, User.find, Error!";
			Err.wsError(req, res, info);
		} else {
			res.render('./user/bser/order/listMonth', {
				title : '月订单',
				crUser: crUser,
				users : users,
				selUserCode: req.query.selUserCode,
				months: months
			});
		}
	})
}
exports.bsOrdersMonthAjax = function(req, res) {
	let crUser = req.session.crUser;

	let symOper = '$ne';
	let condOper = " ";
	// 在这的作用是 老板选择查看某人的出售订单使用
	if(req.query.selUserCode && req.query.selUserCode !=0 ) {
		symOper = '$eq';
		condOper = req.query.selUserCode;
	}

	let condWord = "";
	if(req.query.keyword) {
		condWord = req.query.keyword.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}

	// 根据创建时间筛选
	let begin = parseInt(req.query.begin);
	let ended = parseInt(req.query.ended);
	symCreatS = "$gte"; condCreatS = begin;
	symCreatF = "$lt"; condCreatF = ended;

	Order.find({
		'firm': crUser.firm,
		'code': new RegExp(condWord + '.*'),
		'ctAt': {[symCreatS]: condCreatS, [symCreatF]: condCreatF},
		// 'creater': {[symOper]: condOper},
	})
	.populate('cter')
	.sort({"ctAt": -1})
	.exec(function(err, orders) {
		if(err) {
			res.json({success: 0, info: "bsOrdersMonthAjax, Order.find, Error!"})
		} else {
			// console.log(1)
			// console.log(orders)
			res.json({success: 1, orders: orders, keyword: req.query.keyword})
		}
	})
}

exports.orderNew = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	let id = req.body.id;
	let cterId = null;
	if(obj.cter) cterId = obj.cter;
	obj.imp = parseFloat(obj.imp);
	obj.pdPr = parseFloat(obj.pdPr);
	obj.real = parseFloat(obj.real);
	if(isNaN(obj.imp) || isNaN(obj.pdPr) || isNaN(obj.real)) {
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
					info = "OrderNew, Pdfir.findOne, Error!";
					res.json({success: 0, info: info});
				} else {
					let _order = _.extend(order, obj);
					_order.cter = cterId;
					fkOrdUpd_setOrdfir(req, res, _order, firs)
				}
			})
		} else {	// 新订单（包括 复制）
			Order.findOne({
				'firm' : crUser.firm,
				'creater': crUser._id
			})	// 为了给新订单赋值单号
			.sort({'ctAt': -1})
			.exec(function(err, preOrder) {
				if(err) {
					console.log(err)
					info = "OrderNew, Pdfir.findOne, Error!";
					res.json({success: 0, info: info});
				} else {
					let code = null;
					if(preOrder) {
						code = preOrder.code;
					}
					obj.code = fcOrderGetCode(code, crUser.cd);
					obj.firm = crUser.firm;
					obj.creater = crUser._id;
					let _order = new Order(obj)
					_order.cter = cterId;
					fkOrdNew_setOrdfir(req, res, _order, firs)
				}
			})
		}
	}
}

let fkOrdUpd_setOrdfir = function(req, res, order, firs) {
	let newfirs = new Array();		// 新增的产品
	let updfirs = new Array();		// 被更新的产品
	let delfirs = new Array();		// 被删除的产品

	let orgFirs = order.ordfirs;	// 原本订单的产品
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
			if(orgFirs[j].pdfir && orgFirs[j].pdfir._id == fir.pdfir) {
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
	ord_updDBs(req, res, newfirs, order, updfirs, 0);
	fkOrder_unRelPds(delfirs, 0);
}
let ord_updDBs = function(req, res, newfirs, order, updfirs, n) {
	if(n == updfirs.length) {
		ord_newDBs(req, res, order, newfirs, 0, true)
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
					ord_updDBs(req, res, newfirs, order, updfirs, n+1)
				})
			})
		})
	}
}

let fkOrdNew_setOrdfir = function(req, res, order, firs) {
	let newfirs = new Array();
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
		ord_newDBs(req, res, order, newfirs, 0, false);
	}
}
let ord_newDBs = function(req, res, order, newfirs, n, isUpd) {
	if(n == newfirs.length) {
		// console.log(order.cter);
		order.save(function(err, orderSv) {
			if(err) {
				info = "ord newDBs, Order.save, Error!";console.log(err);
				res.json({success: 0, info: info});
			} else {
				Order.findOne({_id: order._id})
				.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
				.populate('cter')
				.exec(function(err, orderFn) {
					if(err) {
						info = "OrderNew, Order.findOne, Error!";console.log(err);
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
					ord_newDBs(req, res, order, newfirs, n+1, isUpd)
				})
			})
		})
	}
}



exports.orderDelSts = function(req, res) {
	let crUser = req.session.crUser;
	let orderId = req.query.orderId
	Order.findOne({_id: orderId, 'firm': crUser.firm})
	.populate({path: 'ordfirs', populate:{path: 'pdfir'}})
	.populate('cter')
	.exec(function(err, order) {
		if(err) {
			console.log(err);
			info = "orderDel, Order.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!order) {
			info = "订单已经不存在, 请刷新查看!";
			Err.usError(req, res, info);
		} else {
			order.status = 10;
			order.save(function(err, orderSv) {
				if(err) {
					info = "orderDel, Order.deleteOne, Error!";
					res.json({success: 0, info: info})
				} else {
					res.json({success: 1})
				}
			})
		}
	})
}
// exports.orderDel = function(req, res) {
// 	let crUser = req.session.crUser;
// 	let orderId = req.query.orderId
// 	Order.findOne({_id: orderId, 'firm': crUser.firm})
// 	.populate({path: 'ordfirs', populate:{path: 'pdfir'}})
// 	.populate('cter')
// 	.exec(function(err, order) {
// 		if(err) {
// 			console.log(err);
// 			info = "orderDel, Order.findOne, Error!";
// 			Err.usError(req, res, info);
// 		} else if(!order) {
// 			info = "订单已经不存在, 请刷新查看!";
// 			Err.usError(req, res, info);
// 		} else {
// 			fkOrder_unRelPds(order.ordfirs, 0) // 删除订单时 pd和ord解除关联
// 			Order.deleteOne({_id: orderId}, function(err, orderRm) {
// 				if(err) {
// 					info = "orderDel, Order.deleteOne, Error!";
// 					res.json({success: 0, info: info})
// 				} else {
// 					res.json({success: 1})
// 				}
// 			})
// 		}
// 	})
// }
// 删除订单时 pd和ord解除关联, 并删除ordfir
let fkOrder_unRelPds = function(ordfirs, n) {
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
		fkOrder_unRelPds(ordfirs, n+1)
	})
}







let fcOrderGetCode = function(code, userCd) {
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
	
	return String(today) + userCd + String(preOrdNum);
}

