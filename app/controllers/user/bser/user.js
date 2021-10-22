let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../config/conf');

let User = require('../../../models/login/user')
let Firm = require('../../../models/login/firm')
let Color = require('../../../models/material/color');
let Pdfir = require('../../../models/material/pdfir');

let _ = require('underscore')

exports.bser = function(req, res) {
	let crUser = req.session.crUser;
	res.render('./user/bser/index/index', {
		title: '管理',
		crUser : crUser,
	})
}

exports.bsUserUpd = function(req, res) {
	let obj = req.body.obj
	if(obj.code) {
		obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}
	if(obj.cd) {
		obj.cd = obj.cd.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}
	User.findOne({_id: obj._id}, function(err, user) {
		if(err) {
			info = "bser UserUpd, User Findone Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此用户已经被删除";
			Err.usError(req, res, info);
		} else {
			if(obj.pwd || obj.pwd == "") {
				usUser_changePwd(req, res, obj, user);
			} else if(obj.code && obj.code != user.code) {
				usUser_changeCode(req, res, obj, user);
			} else {
				usUser_save(req, res, obj, user);
			}
		}
	})
}
let bcrypt = require('bcryptjs');
let usUser_changePwd = function(req, res, obj, user) {
	let crUser = req.session.crUser;
	if(crUser._id == user._id) {
		obj.pw = obj.pw.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		bcrypt.compare(obj.pw, user.pwd, function(err, isMatch) {
			if(err) console.log(err);
			if(!isMatch) {
				info = "原密码错误，请重新操作";
				Err.usError(req, res, info);
			}
			else {
				usUser_save(req, res, obj, user);
			}
		});
	} else if(user.role != 1) {
		usUser_save(req, res, obj, user);
	} else {
		info = "您无权修改此人密码";
		res.json({success: 0, info: info})
	}
}
let usUser_changeCode = function(req, res, obj, user) {
	User.findOne({code: obj.code})
	.where('_id').ne(obj._id)
	.exec(function(err, objSame) {
		if(err) {
			info = "bser User ChangeCode, User Findone Error!";
			Err.usError(req, res, info);
		} else if(objSame) {
			info = "此用户名已经存在";
			Err.usError(req, res, info);
		} else {
			usUser_save(req, res, obj, user);
		}
	})
}
let usUser_save = function(req, res, obj, user) {
	let _user = _.extend(user, obj)
	_user.save(function(err, userSave) {
		if(err) {
			info = "bser User_Save, User Save Error!"
			Err.usError(req, res, info);
		} else {
			if(req.session.crUser._id == userSave._id) {
				req.session.crUser = userSave;
			}
			res.redirect('/bsUser/'+userSave._id)
		}
	})
}


exports.bsUsers = function(req, res) {
	let crUser = req.session.crUser;
	
	User.find({'firm': crUser.firm})
	.exec(function(err, users) {
		if(err) {
			info = "bser Users, User Find Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bser/index/users', {
				title: '成员列表',
				crUser: crUser,

				users: users
			})
		}
	})
}

exports.bsUser = function(req, res) {
	let crUser = req.session.crUser;
	let userId = req.params.userId;
	User.findOne({_id: userId, firm: crUser.firm})
	.exec(function(err, user) {
		if(err) {
			info = "bser User, User FindOne Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此帐号已经被删除";
			Err.wsError(req, res, info);
		} else {
			res.render('./user/bser/index/user', {
				title: '成员信息',
				crUser: crUser,

				user: user
			})
		}
	})
}










exports.bsFirm = function(req, res) {
	let crUser = req.session.crUser;
	
	Firm.findOne({'_id': crUser.firm})
	.exec(function(err, firm) {
		if(err) {
			info = "bser firm, Firm Find Error!";
			Err.usError(req, res, info);
		} else if(!firm) {
			info = "公司信息出现错误，联系管理员";
			Err.wsError(req, res, info);
		} else {
			res.render('./user/bser/index/firm/firm', {
				title: '公司信息',
				crUser: crUser,

				firm: firm
			})
		}
	})
}

exports.bsFirmUpd = function(req, res) {
	let obj = req.body.obj;
	Firm.findOne({_id: obj._id}, function(err, firm) {
		if(err) {
			console.log(err);
			info = "bsFirmUpd, Firm.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!firm) {
			info = "公司信息被删除, 请联系管理员";
			Err.usError(req, res, info);
		} else {
			let _firm = _.extend(firm, obj);
			_firm.save(function(err, firmSave) {
				if(err) {
					info = "修改公司信息时，数据库保存错误 请联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bsFirm')
				}
			});
		}
	});
}

exports.bsPostAdd = function(req, res) {
	let crUser = req.session.crUser;
	let postObj = req.body.obj;
	Firm.findOne({_id: crUser.firm}, function(err, firm) {
		if(err) console.log(err);
		if(!firm) {
			info = "修改公司信息时，数据库保存错误 请联系管理员";
			Err.usError(req, res, info);
		} else {
			firm.posts.push(postObj);
			firm.save(function(err, firmSave) {
				if(err) console.log(err);
				res.redirect('/bsFirm')
			})
		}
	})
}

exports.bsPostDel = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Firm.findOne({_id: crUser.firm}, function(err, firm) {
		if(err) console.log(err);
		if(!firm) {
			info = "修改公司信息时，数据库保存错误 请联系管理员";
			Err.usError(req, res, info);
		} else {
			for(let i=0; i<firm.posts.length; i++) {
				let post = firm.posts[i];
				if(post._id == id) {
					let orgPhoto = post.photo;
					MdPicture.deleteOldPhoto(orgPhoto, Conf.photoPath.firmPostPhoto);
					firm.posts.remove(post);
				}
			}
			firm.save(function(err, firmSave) {
				if(err) console.log(err);
				res.redirect('/bsFirm')
			})
		}
	})
}

exports.bsColors = function(req, res) {
	let crUser = req.session.crUser;
	Color.find({firm: crUser.firm})
	.exec(function(err, colors) {
		if(err) {
			console.log(err);
			info = "修改公司信息时，数据库保存错误 请联系管理员";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bser/index/color/list', {
				title: '颜色库',
				crUser,
				colors
			})
		}
	})
}
exports.bsColorAdd = function(req, res) {
	let crUser = req.session.crUser;
	res.render('./user/bser/index/color/add', {
		title: '添加颜色',
		crUser,
	})
}
exports.bsColorNew = function(req, res) {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	Color.findOne({
		firm: crUser.firm,
		code: obj.code
	})
	.exec(function(err, colorSame) {
		if(err) {
			console.log(err);
			info = "bser ColorAdd, Color.findOne, Error!";
			Err.usError(req, res, info);
		} else if(colorSame) {
			info = "颜色库中已经存在此颜色";
			Err.usError(req, res, info);
		} else {
			let _color = new Color(obj);
			_color.save(function(err, colorSave) {
				if(err) {
					console.log(err);
					info = "bser ColorAdd, Color.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/bsColors")
				}
			})
		}
	})
}

exports.bsColorDelAjax = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.query.id;

	Color.findOne({
		firm: crUser.firm,
		_id: id
	})
	.exec(function(err, color) {
		if(err) {
			console.log(err);
			info = "bser ColorAdd, Color.findOne, Error!";
			res.json({success: 0, info: info})
		} else if(!color) {
			info = "颜色库中不存在此颜色";
			res.json({success: 0, info: info})
		} else {
			Pdfir.find({'colors': id}, {'colors': 1, 'code': 1}, function(err, pdfirs) {
				if(err) {
					console.log(err);
					info = "bser ColorAdd, Pdfir.find, Error!";
					res.json({success: 0, info: info})
				} else if(pdfirs && pdfirs.length > 0) {
					info = "请先删除以下产品中的此颜色: "
					for(let i=0; i<pdfirs.length; i++) {
						info += pdfirs[i].code + ' ';
					}
					res.json({success: 0, info: info})
				} else {
					Color.deleteOne({_id: id}, function(err, objRm) {
						if(err) {
							info = "bser ColorDelAjax, Color.deleteOne, Error!";
							Index.adOptionWrong(req, res, info);
						} else {
							res.json({success: 1})
						}
					})
				}
			})
		}
	})
}