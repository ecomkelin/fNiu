let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;

const colection = 'Color';
let dbSchema = new Schema({
	/* ------------------ 创建时 ------------------ */
	firm: {type: ObjectId, ref: 'Firm'},
	code: String,	// 本公司唯一
	nome: String,

	weight: Number,
	upAt: Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.weight) this.weight = 1;
	} else {

	}
	this.upAt = Date.now();
	next();
})

module.exports = mongoose.model(colection, dbSchema);