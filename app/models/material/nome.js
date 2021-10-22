let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Nome';
let dbSchema = new Schema({
	/* ------------------ 创建时 ------------------ */
	firm: {type: ObjectId, ref: 'Firm'},
	code: String,	// 本公司唯一

	status: Number,
	weight: Number,
	quant: Number, // 店长推荐

	upAt: Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.status) this.status = 0;
		if(!this.weight) this.weight = 0;
		if(!this.quant) this.quant = 1;
	} else {

	}
	this.upAt = Date.now();
	next();
})

module.exports = mongoose.model(colection, dbSchema);