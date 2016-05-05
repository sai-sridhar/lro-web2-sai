var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    renewalComm : { type : Schema.ObjectId, ref : 'renewalcomms' },
    community : { type : Schema.ObjectId, ref : 'communities' },
    batch : { type : Schema.ObjectId, ref : 'renewalbatches' },
    unitNumber : String,
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
	userOverridePct : Number,
	userOverrideDollars : Number,
	userOverrideMode : String,
	finalRecRent : Number
});

module.exports = mongoose.model('RenewalUnit', modelSchema);
