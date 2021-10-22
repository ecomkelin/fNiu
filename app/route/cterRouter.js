let Index = require('../controllers/aaIndex/index');

let Cter = require('../controllers/cter/cter');

let Product = require('../controllers/cter/product');

let Orc = require('../controllers/cter/orc');
// let Cter = require('../controllers/cter/cter/order/cter');
// let Ordfir = require('../controllers/cter/cter/order/ordfir');


let MdBcrypt = require('../middle/middleBcrypt');
let MdRole = require('../middle/middleRole');

let multipart = require('connect-multiparty');
let postForm = multipart();

module.exports = function(app){
	app.get('/cter', Cter.cter);
	/* =================================== Cter =================================== */
	app.get('/ctMyself', Cter.ctCter)
	// app.post('/ctCterUpdInfo', MdRole.cterIsLogin, postForm, Cter.ctCterUpd)
	// app.post('/ctCterUpdPwd', MdRole.cterIsLogin, postForm, MdBcrypt.rqBcrypt, Cter.ctCterUpd)


	/* ======================================== product ======================================== */
	app.get('/products', Product.products);
	app.get('/product/:id', Product.product);

	app.get('/pdnomes', Product.pdnomes);
	/* ======================================== nome ======================================== */
	

	/* ======================================== order ======================================== */
	app.post('/ctOrcpdNewAjax', MdRole.cterIsLogin, postForm, Orc.ctOrcpdNewAjax);
	app.get('/ctOrcpdDelAjax', MdRole.cterIsLogin, Orc.ctOrcpdDelAjax);
	app.get('/ctOrcpdUpdAjax', MdRole.cterIsLogin, Orc.ctOrcpdUpdAjax);
	app.get('/ctOrcSubAjax', MdRole.cterIsLogin, Orc.ctOrcSubAjax);

	app.get('/order/:id', MdRole.cterIsLogin, Orc.order);
};