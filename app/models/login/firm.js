let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const colection = 'Firm';
let dbSchema = new Schema({
	// union: {type: ObjectId, ref: 'Firm'},	// 公司所属协会
	// type: Number,			// 公司所属类型 Conf中有

	code: {
		unique: true,
		type: String
	},
	nome: String,
	iva: String,
	cf: String,	// codice fisicale 税号
	post: String,
	addr: String,
	city: String,
	nation: String,
	tel: String,
	bank: String,
	iban: String,
	resp: String,// 负责人

	posts: [{
		photo: String,
		title: String,
		desp: String,
		weight: Number
	}],

	ctAt: Date,
	upAt: Date,
});
dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.upAt = this.ctAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
});

module.exports = mongoose.model(colection, dbSchema);