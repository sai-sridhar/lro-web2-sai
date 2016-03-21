var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    renewalComm : String,
    batch : String,
    unitId : String,
	unitType : String,
	pmsUnitType : String,
	beds : Number,
	baths : Number,
	renewalDate : Date,
	resident : String,
	amenities : String,
	amenityAmount : Number,
	currentLeaseTerm : Number,
	recLeaseTerm : Number,
	currentRent : Number,
	recRent : Number,
	cmr : Number,
	approved : Boolean,
	notice : Boolean,
	renewed : Boolean,
	undecided : Boolean,
	overrideRent : Number,
	overrideLeaseTerm : Number,
});

module.exports = mongoose.model('RenewalUnit', modelSchema);
