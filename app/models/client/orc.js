let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Orc';
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	cter: {type: ObjectId, ref: 'Cter'},
	// 1 购物车 5 生成 10 确认
	status: Number,

	code: String,	// 本公司唯一 暂时简单

	orcpds: [{type: ObjectId, ref: 'Orcpd'}],
	imp: Float,		// 实际收费

	ctAt: Date,
	upAt: Date,
	fnAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.status) this.status = 1;
		this.ctAt = this.upAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);