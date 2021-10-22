let Print = require('../controllers/user/pter/print')

let MdRole = require('../middle/middleRole');

module.exports = function(app){
	app.get('/pter', MdRole.pterIsLogin, Print.pter);

	// Ticket     --------------------------------------------------------------------
	app.get('/ptTicket', MdRole.pterIsLogin, Print.ptAutoTk, Print.ptTicket)
	app.get('/ptChangeTicket', MdRole.pterIsLogin, Print.ptChangeTicket)// 为了打印后刷新用的

	// Stamp     --------------------------------------------------------------------
	app.get('/ptStamp', MdRole.pterIsLogin, Print.ptAutoSp, Print.ptStamp)
	app.get('/ptChangeStamp', MdRole.pterIsLogin, Print.ptChangeStamp)// 为了打印后刷新用的
};