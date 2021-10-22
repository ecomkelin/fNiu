let Err = require('./err');

exports.index = function(req, res) {
	// 判断是否登录
	// console.log(req.session)
	if(req.session.crUser) {
		let crUser = req.session.crUser
		if(crUser.role == 1) {
			res.redirect('/bser');
		}
		// else if(crUser.role == 3) {
		// 	res.redirect('/pter');
		// }
		// else if(crUser.role == 5) {
		// 	res.redirect('/sfer');
		// }
		else {
			delete req.session.crUser;
			info = "登录角色错误，请联系管理员";
			Err.usError(req, res, info);
		}
	}
	else {
		res.redirect('/cter');
	}
}



exports.login = function(req, res) {
	res.render('./login', {
		title: 'Login',
		action: "/loginUser",
		code: "code",
		pwd: "pwd"
	});
}



let User = require('../../models/login/user');
let Cter = require('../../models/client/cter');

let bcrypt = require('bcryptjs');
exports.loginUser = function(req, res) {
	// User
	if(req.session.crUser) delete req.session.crUser;
	// Cter
	if(req.session.crCter) delete req.session.crCter;
	if(req.session.proNomes) delete req.session.proNomes;
	// Ader
	if(req.session.crAder) delete req.session.crAder;

	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let pwd = String(req.body.pwd).replace(/(\s*$)/g, "").replace( /^\s*/, '');
	if(pwd.length == 0) pwd = " ";

	loginUserf(req, res, code, pwd);
}
let loginUserf = function(req, res, code, pwd) {
	User.findOne({code: code})
	.populate('firm')
	.exec(function(err, user) {
		if(err) console.log(err);
		if(!user){
			loginCterf(req, res, code, pwd)
		} else{
			bcrypt.compare(pwd, user.pwd, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					user.lgAt = Date.now();
					// console.log(user)
					user.save(function(err, objSave){
						if(err) console.log(err)
					})
					req.session.crUser = user;

					if(user.role == 1) {
						res.redirect('/bser');
					}
					else if(user.role == 3) {
						res.redirect('/pter');
					}
					else if(user.role == 5) {
						res.redirect('/order');
					}
					else {
						info = "登录角色错误，请联系管理员";
						Err.usError(req, res, info);
					}
				}
				else {
					loginCterf(req, res, code, pwd)
				}
			})
		}
	})
}
let loginCterf = function(req, res, code, pwd) {
	Cter.findOne({code: code})
	.exec(function(err, cter) {
		if(err) console.log(err);
		if(!cter){
			info = "用户名不正确，请重新登陆";
			Err.usError(req, res, info);
		} else if(cter.canLogin != 1) {
			info = "您无权登录, 请联系商家";
			Err.usError(req, res, info);
		} else{
			bcrypt.compare(pwd, cter.pwd, function(err, isMatch) {
				if(err) console.log(err);
				if(isMatch) {
					cter.lgAt = Date.now();
					// console.log(cter)
					cter.save(function(err, objSave){
						if(err) console.log(err)
					})
					req.session.crCter = cter;
						
					res.redirect('/cter');
					
				}
				else {
					info = "用户名与密码不符，请重新登陆";
					Err.usError(req, res, info);
				}
			})
		}
	})
}

exports.logout = function(req, res) {
	// User
	if(req.session.crUser) delete req.session.crUser;
	// Cter
	if(req.session.crCter) delete req.session.crCter;
	if(req.session.proNomes) delete req.session.proNomes;
	// Ader
	if(req.session.crAder) delete req.session.crAder;

	res.redirect('/');
}