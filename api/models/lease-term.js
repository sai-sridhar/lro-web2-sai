var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    term 			: Number,
    baseRent		: Number,
    totalConcession : Number,
    effectiveRent	: Number,
    newPricing : 	{ type : Schema.ObjectId, ref : 'newpricings' }
    // newPricing		: String
});

module.exports = mongoose.model('LeaseTerm', modelSchema);
