let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Order';
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	creater: {type: ObjectId, ref: 'User'},
	// 0 正常 10 删除
	status: Number,

	code: String,	// 本公司唯一 暂时简单
	cter: {type: ObjectId, ref: 'Cter'},

	ordfirs: [{type: ObjectId, ref: 'Ordfir'}],
	real: Float,	// 原价
	pdPr: Float,	// 打折后价格
	imp: Float,		// 实际收费

	note: String,

	ticketing: {
		type: Number,
		default: 0
	},
	stamping: {
		type: Number,
		default: 0
	},

	ctAt: Date,
	upAt: Date,
	fnAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.status) this.status = 0;
		this.ctAt = this.upAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);