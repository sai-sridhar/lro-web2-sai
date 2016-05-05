var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    name 			: String,
    startDate		: Date,
    endDate 		: Date,
    month			: String,
    status			: String,
    communities		: [],
    units 			: []
});

module.exports = mongoose.model('RenewalBatch', modelSchema);
