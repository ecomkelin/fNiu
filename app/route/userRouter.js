let Index = require('../controllers/aaIndex/index');

let User = require('../controllers/user/bser/user');

let OdProd = require('../controllers/user/order/product');
let OdCter = require('../controllers/user/order/cter');
let Ord = require('../controllers/user/order/order');

let Product = require('../controllers/user/bser/product');
let Prod = require('../controllers/user/bser/prod');

let Nome = require('../controllers/user/bser/nome');

let Cter = require('../controllers/user/bser/order/cter');
let Order = require('../controllers/user/bser/order/order');
let Ordfir = require('../controllers/user/bser/order/ordfir');

let Orc = require('../controllers/user/bser/orc');


let MdBcrypt = require('../middle/middleBcrypt');
let MdRole = require('../middle/middleRole');
let MdPicture = require('../middle/middlePicture');
const MdFiles = require('../middle/filesLocal');

let multipart = require('connect-multiparty');
let postForm = multipart();

module.exports = function(app){
	/* ================================ Index ================================ */
	app.get('/order', MdRole.userIsLogin, Ord.order);

	app.get('/getPdfirs', MdRole.userIsLogin, OdProd.getPdfirs)
	app.get('/getCters', MdRole.userIsLogin, OdCter.getCters)

	/* =========================== order =========================== */
	app.post('/orderNew', postForm, Ord.orderNew);		// 不要角色判断，因为自动退出
	app.get('/orderDelSts', MdRole.userIsLogin, Ord.orderDelSts);
	// app.get('/orderDel', MdRole.userIsLogin, Ord.orderDel);
	app.get('/getOrders', MdRole.userIsLogin, Ord.getOrders);
	app.get('/OrderExcel/:id', MdRole.userIsLogin, Ord.OrderExcel);
	app.get('/getOrderAjax', MdRole.userIsLogin, Ord.getOrderAjax);

	app.get('/bsOrdersMonth', MdRole.bserIsLogin, Ord.bsOrdersMonth);
	app.get('/bsOrdersMonthAjax', MdRole.bserIsLogin, Ord.bsOrdersMonthAjax)
	/* -------- 从order中添加新产品和新客户 -------- */
	app.post('/ordAddPdfir', MdRole.userIsLogin, postForm, Ord.ordAddPdfir);
	app.post('/ordAddCter', MdRole.userIsLogin, postForm, Ord.ordAddCter);
	





	app.get('/bser', MdRole.bserIsLogin, User.bser);
	/* =================================== User =================================== */
	app.get('/bsUsers', MdRole.bserIsLogin, User.bsUsers)
	app.get('/bsUser/:userId', MdRole.bserIsLogin, User.bsUser)
	app.post('/bsUserUpdInfo', MdRole.bserIsLogin, postForm, User.bsUserUpd)
	app.post('/bsUserUpdPwd', MdRole.bserIsLogin, postForm, MdBcrypt.rqBcrypt, User.bsUserUpd)

	app.get('/bsFirm', MdRole.bserIsLogin, User.bsFirm)
	app.post('/bsFirmUpd', MdRole.bserIsLogin, postForm, User.bsFirmUpd);

	app.post('/bsPostAdd', MdRole.bserIsLogin, postForm, MdPicture.addNewPhotoOrg, User.bsPostAdd);
	app.get('/bsPostDel/:id', MdRole.bserIsLogin, User.bsPostDel);

	app.get('/bsColors', MdRole.bserIsLogin, User.bsColors)
	app.get('/bsColorAdd', MdRole.bserIsLogin, User.bsColorAdd)
	app.post('/bsColorNew', MdRole.bserIsLogin, postForm, User.bsColorNew);
	app.get('/bsColorDelAjax', MdRole.bserIsLogin, User.bsColorDelAjax)
	/* =================================== Firm =================================== */

	/* ======================================== product ======================================== */
	app.get('/bsPdfirs', MdRole.bserIsLogin, Product.bsPdfirs);
	app.get('/bsPdfirsAjax', MdRole.bserIsLogin, Product.bsPdfirsAjax);
	app.get('/bsPdfirAdd', MdRole.bserIsLogin, Product.bsPdfirAdd);
	app.post('/bsPdfirNew', MdRole.bserIsLogin, postForm, MdPicture.addNewPhoto, Product.bsPdfirNew);
	app.get('/bsPdfir/:id', MdRole.bserIsLogin, Product.bsPdfir);

	app.post('/bsPdfirUpd', MdRole.bserIsLogin, postForm, MdPicture.addNewPhoto, Product.bsPdfirUpd);
	app.post('/bsPdfirUpdFile', MdRole.bserIsLogin, postForm, MdFiles.newFile, Product.bsPdfirUpdFile);
	app.get('/bsPdfirDel/:id', MdRole.bserIsLogin, Product.bsPdfirDel);

	app.post('/bsPdfirPostAdd', MdRole.bserIsLogin, postForm, MdPicture.addNewPhotos, Product.bsPdfirPostAdd);
	app.get('/bsPdfirPostDel/:id', MdRole.bserIsLogin, Product.bsPdfirPostDel);

	app.get('/bsPdAjaxCode', MdRole.bserIsLogin, Product.bsPdAjaxCode);
	/* ===================== product color size ===================== */
	app.get('/bsPdColorAjax', MdRole.bserIsLogin, Product.bsPdColorAjax);

	app.get('/bsPdAjaxNewSize', MdRole.bserIsLogin, Product.bsPdAjaxNewSize);
	app.get('/bsPdAjaxDelSize', MdRole.bserIsLogin, Product.bsPdAjaxDelSize);


	/* =================================== Nome =================================== */
	app.get('/bsNomeRevise', MdRole.bserIsLogin, Nome.bsNomeRevise);
	app.get('/bsNomes', MdRole.bserIsLogin, Nome.bsNomes);
	app.get('/bsNomeAdd', MdRole.bserIsLogin, Nome.bsNomeAdd);
	app.post('/bsNomeNew', MdRole.bserIsLogin, postForm, Nome.bsNomeNew);
	app.get('/bsNome/:id', MdRole.bserIsLogin, Nome.bsNome);

	app.post('/bsNomeUpd', MdRole.bserIsLogin, postForm, Nome.bsNomeUpd);
	app.get('/bsNomeDel/:id', MdRole.bserIsLogin, Nome.bsNomeDel)

	app.get('/bsNomeChStsAjax', MdRole.bserIsLogin, Nome.bsNomeChStsAjax);
	app.get('/bsGetNomesAjax', MdRole.bserIsLogin, Nome.bsGetNomesAjax);

	

	/* =================================== cter =================================== */
	app.get('/bsCterAdd', MdRole.bserIsLogin, Cter.bsCterAdd)
	app.get('/bsCters', MdRole.bserIsLogin, Cter.bsCters)
	app.get('/bsCter/:cterId', MdRole.bserIsLogin, Cter.bsCter)
	app.get('/bsCterDel/:cterId', MdRole.bserIsLogin, Cter.bsCterDel)
	app.delete('/bsCterDelAjax', MdRole.bserIsLogin, Cter.bsCterDelAjax)
	
	app.post('/bsCterUpd', MdRole.bserIsLogin, postForm, Cter.bsCterUpd)
	app.post('/bsCterUpdLogin', MdRole.bserIsLogin, postForm, MdBcrypt.rqBcrypt, Cter.bsCterUpdLogin)

	app.post('/bsCterNew', MdRole.bserIsLogin, postForm, Cter.bsCterNew)

	app.get('/bsCterIsAjax', MdRole.bserIsLogin, Cter.bsCterIsAjax)
	app.get('/bsCtersObtAjax', MdRole.bserIsLogin, Cter.bsCtersObtAjax)

	/* ======================================== order ======================================== */
	app.post('/bsOrderNew', MdRole.bserIsLogin, postForm, Order.bsOrderNew);
	app.get('/bsOrderDel', MdRole.bserIsLogin, Order.bsOrderDel)

	app.get('/bsOrders', MdRole.bserIsLogin, Order.bsOrders);
	app.get('/bsOrdersAjax', MdRole.bserIsLogin, Order.bsOrdersAjax);
	// app.get('/bsOrdHis', MdRole.bserIsLogin, Order.bsOrdHis);
	// app.post('/bsOrdChangeSts', MdRole.bserIsLogin, postForm, Order.bsOrdChangeSts);
	app.get('/bsOrderTicketing', MdRole.userIsLogin, Order.bsOrderTicketing);
	app.get('/bsOrderStamping', MdRole.userIsLogin, Order.bsOrderStamping);
	/* ----------- ordfir 根据 pd 或者 客户 查看销量 ----------- */
	app.get('/bsOrdfirsPd', MdRole.bserIsLogin, Ordfir.bsOrdfirsPd);
	app.get('/bsOrdfirsCt', MdRole.bserIsLogin, Ordfir.bsOrdfirsCt);
	app.get('/bsOrdfirsCter', MdRole.bserIsLogin, Ordfir.bsOrdfirsCter);

	/* ======================================== orc 客户线上订单 ======================================== */
	app.get('/bsOrcs', MdRole.bserIsLogin, Orc.bsOrcs);
	app.get('/bsHisOrcs', MdRole.bserIsLogin, Orc.bsHisOrcs);

	app.get('/bsOrc/:id', MdRole.bserIsLogin, Orc.bsOrc);
	app.get('/bsOrcSubAjax', MdRole.bserIsLogin, Orc.bsOrcSubAjax);
};