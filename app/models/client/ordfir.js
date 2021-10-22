let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Ordfir';
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	creater: {type: ObjectId, ref: 'User'},
	ctAt: Date,
	upAt: Date,

	order: {type: ObjectId, ref: 'Order'},

	cter: {type: ObjectId, ref: 'Cter'},

	pdfir: {type: ObjectId, ref: 'Pdfir'},
	price: Float,

	quot : Number,
	orgQuot : Number,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		this.ctAt = this.upAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	this.orgQuot = this.quot;
	next();
})

module.exports = mongoose.model(colection, dbSchema);