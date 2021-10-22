let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Orcpd';
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	cter: {type: ObjectId, ref: 'Cter'},
	ctAt: Date,
	upAt: Date,
	orc: {type: ObjectId, ref: 'Orc'},

	pdfir: {type: ObjectId, ref: 'Pdfir'},
	price: Float,

	sizes: [String],
	colors : [{
		colorcode: String,
		colornome: String,
		cquot: Number,
		sizes: [{
			size: String,
			quot: Number,
		}]
	}],
	quot: Number,
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