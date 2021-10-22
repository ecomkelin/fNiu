let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Pdfir';
let dbSchema = new Schema({
	/* ------------------ 创建时 ------------------ */
	code: String,	// 本公司唯一
	nome: String,
	photo: {type: String, default: '/upload/product/1.jpg' },
	material: String,
	colors: [{type: ObjectId, ref: 'Color'}],
	sizes: [String],
	// assists : [{type: ObjectId, ref: 'Assist'}],
	price: Float,
	cost: {type: Float, default: 0},	// 成本价格
	note: String,
	/* ------------------ 创建时 ------------------ */

	/* ------------------ 自动生成 ------------------ */
	firm: {type: ObjectId, ref: 'Firm'},
	creater: {type: ObjectId, ref: 'User'},
	ctAt: Date,
	upAt: Date,
	/* ------------------ 自动生成 ------------------ */

	status: Number,
	rcmd: Number, // Recommended 店长推荐
	weight: Number,
	posts: [{
		photo: String,
		weight: Number
	}],


	stock: Number,  // 库存
	sales: Number,  // 销量

	ordfirs: [{type: ObjectId, ref: 'Ordfir'}],	// 未完成的订单
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.sales) this.sales = 0;
		if(!this.stock) this.stock = 0;
		if(!this.cost) this.cost = 0;
		this.ctAt = this.upAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);