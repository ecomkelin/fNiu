let AdIndex = require('../controllers/ader/index');
exports.aderIsLogin = function(req, res, next) {
	let crAder = req.session.crAder;
	if(!crAder) {
		info = "需要您的 Administrator 账户,请输入";
		AdIndex.adOptionWrong(req, res, info);
	} else {
		next();
	}
};


let User = require('../models/login/user');
let Err = require('../controllers/aaIndex/err');
exports.singleUsLogin = function(req, res, next){
	let crUser = req.session.crUser;
	User.findById(crUser._id, function(err, user){ 
		if(err) {
			console.log(err);
			info = "singleUsLogin, User.findById, Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此帐号已经被删除!";
			Err.usError(req, res, info);
		} else {
			let crLog = (new Date(crUser.lgAt)).getTime();
			let atLog = (new Date(user.lgAt)).getTime();
			if(crLog == atLog){
				next();
			}else{
				res.redirect('/logout');
			}
		} 
	});
};


exports.bserIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser || crUser.role != 1) {
		res.redirect('/logout');
	} else {
		next();
	}
};


exports.pterIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser || crUser.role != 3) {
		res.redirect('/logout');
	} else {
		next();
	}
};


exports.sferIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser || crUser.role != 5) {
		res.redirect('/logout');
	} else {
		next();
	}
};

exports.userIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/logout');
	} else {
		next();
	}
};

let Cter = require('../models/client/cter');
exports.singleCtLogin = function(req, res, next){
	let crCter = req.session.crCter;
	Cter.findById(crCter._id, function(err, cter){ 
		if(err) {
			console.log(err);
			info = "singleCtLogin, Cter.findById, Error!";
			Err.usError(req, res, info);
		} else if(!cter) {
			info = "此帐号已经被删除!";
			Err.usError(req, res, info);
		} else {
			let crLog = (new Date(crCter.lgAt)).getTime();
			let atLog = (new Date(cter.lgAt)).getTime();
			if(crLog == atLog){
				next();
			}else{
				res.redirect('/logout');
			}
		} 
	});
};


exports.cterIsLogin = function(req, res, next) {
	let crCter = req.session.crCter;
	if(!crCter) {
		res.redirect('/logout');
	} else {
		next();
	}
};