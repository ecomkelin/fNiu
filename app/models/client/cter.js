let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Cter';
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	creater: {type: ObjectId, ref: 'User'},

	canLogin: Number,
	code: String,
	pwd: String,
	lgAt: Date,	// 上次登录时间

	nome: String,
	vip: String,

	tel: String,
	iva: String,
	cf: String,
	addr: String,
	post: String,
	city: String,
	doct: String,

	note: String,

	orders: [{type: ObjectId, ref: 'Order'}],
	price: Float,	// 总消费钱数
	times: Number,  // 次数

	ctAt: Date,
	upAt: Date,
});
dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.upAt = this.ctAt = this.lgAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
});

module.exports = mongoose.model(colection, dbSchema);