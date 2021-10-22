let Err = require('../../aaIndex/err');

let Order = require('../../../models/client/order');

exports.pter = function(req, res) {
	let crUser = req.session.crUser;
	res.render('./user/pter/index/index', {
		title: '打印',
		crUser : crUser,
	})
}

exports.ptAutoTk = async(req, res, next)=> {
	try{
		const crUser = req.session.crUser;
		// 第一步 找到需要打印的订单
		const printings = await Order.find({'firm': crUser.firm})
		.where('ticketing').eq(true)
		.populate('firm')
		.populate('cter')
		.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
		.sort({"ctAt": 1})

		// console.log(printings)
		// 如果找到打印的订单
		if(printings.length > 0) {
			req.body.object = printings[0];
			next();
		} 

		// 如果没有找到打印的订单
		else {
			// 第二步 查找最新订单
			const objects = await Order.find({'firm': crUser.firm})
			.populate('firm')
			.populate('cter')
			.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
			.sort({"ctAt": -1})
			.limit(1)

			// 如果找到最新订单
			if(objects.length > 0) {
				req.body.object = objects[0];
				next();
			} 
			// 如果没有订单
			else {
				info = "您还没有订单， 请先添加订单";
				Err.wsError(req, res, info);
			}
		}
	} catch(error) {
		console.log(error);
		Err.wsError(req, res, "ptAutoTk error");
	}
}
exports.ptTicket = function(req, res) {
	const order = req.body.object;
	res.render('./user/pter/ticket/autoPrint', {
		title: '小票打印',
		crUser: req.session.crUser,
		firm: order.firm,
		order,
	});
}


exports.ptChangeTicket = async(req, res) => {
	try {
		let id = req.query.id
		let newTicket = req.query.newTicket;
		const object = await Order.findOne({_id: id})
		if(!object) return res.json({success: 0, info: "系统没有找到此订单, 请刷新页面重试"});

		object.ticketing = parseInt(newTicket);
		const objSave = await object.save();
		if(!objSave) return res.json({success: 0, info: "保存失败"});

		return res.json({success: 1, info: "已经更改"});
	} catch(error) {
		console.log(error);
		res.json({success: 0, info: "ptChangeTicket error"});
	}
}



exports.ptAutoSp = function(req, res, next) {
	let crUser = req.session.crUser;
	// 第一步 找到需要打印的订单
	Order.find({'firm': crUser.firm})
	.where('stamping').eq(true)
	.populate('firm')
	.populate('cter')
	.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
	.sort({"ctAt": 1})
	.exec(function(err, printings) { if(err) {
		info = "pt自动打印时, 数据库错误, 请联系管理员";
		Err.wsError(req, res, info);
	} else {
		// console.log(printings)
		// 如果找到打印的订单
		if(printings.length > 0) {
			req.body.object = printings[0];
			next();
		} 

		// 如果没有找到打印的订单
		else {
			// 第二步 查找最新订单
			Order.find({'firm': crUser.firm})
			.populate('firm')
			.populate('cter')
			.populate({path: 'ordfirs', populate: {path: 'pdfir'}})
			.sort({"ctAt": -1})
			.limit(1)
			.exec(function(err, objects) { if(err) {
				info = "pt自动打印时, 数据库错误, 请联系管理员";
				Err.wsError(req, res, info);
			} else {
				// 如果找到最新订单
				if(objects.length > 0) {
					req.body.object = objects[0];
					next();
				} 
				// 如果没有订单
				else {
					info = "您还没有订单， 请先添加订单";
					Err.wsError(req, res, info);
				}
			} })
		}
	} })
}
exports.ptStamp = function(req, res) {
	let object = req.body.object;
	res.render('./user/pter/stamp/autoPrint', {
		title: '打印机打印',
		crUser: req.session.crUser,
		firm: object.firm,
		order: object,
	});
}
exports.ptChangeStamp = function(req, res) {
	let id = req.query.id
	let newStamp = req.query.newStamp;
	Order.findOne({_id: id}, function(err, object){
		if(err) console.log(err);
		if(object){
			object.stamping = parseInt(newStamp);
			object.save(function(err,objSave) {
				if(err) console.log(err);
				res.json({success: 1, info: "已经更改"});
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"});
		}
	})
}