var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    communityId		: String,
    unitNumber 		: String,
	priceDate 		: Date,
	unitType 		: String,
	unitCategory 	: String,
	status 			: String,
	available 		: Date,
	moveout 		: Date,
	priorRent 		: Number,
	sf 				: Number,
	amenities 		: String,
	pmsUnitType 	: String,
	offset 			: Number,
	amenityAmount 	: Number,
	leaseTerm 		: Number,
	baseRent 		: Number,
	totalConcession : Number,
	effectiveRent 	: Number,
});

module.exports = mongoose.model('NewPricing', modelSchema);
