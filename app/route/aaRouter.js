let Index = require('../controllers/aaIndex/index');

module.exports = function(app){
	const Conf = require('../config/conf');
	const Firm = require('../models/login/firm');
	const Nome = require('../models/material/nome');
	app.use( async(req, res, next) => {
		try {
			const firm = await Firm.findOne().sort({'upAt': -1});
			if(!firm) return res.render('./wrongPage', {title: "500-15 Page", info: "appUse预设:信息加载错误"});
			const nomes = await Nome.find({'firm': firm, 'status': 1});
			req.session.firm = firm
			app.locals.firm = firm
			app.locals.proNomes = nomes
			return next()
		} catch {
			console.log(error);
			return res.render('./wrongPage', {title: "500-15 Page", info: "appUse预设:信息加载错误 error", error});
		}
	})

	// index -------- Vder 首页 登录页面 登录 登出 -----------
	app.get('/', Index.index);
	app.get('/login', Index.login);
	app.post('/loginUser', Index.loginUser);
	app.get('/logout', Index.logout);
	app.get('/error', (req, res) => {
		res.render('./wrongPage', {title: "500-15 Page", info: req.query.info, error: req.query.error});
	});
};