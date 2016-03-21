var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    community 		: String,
    batch			: String
});

module.exports = mongoose.model('RenewalComm', modelSchema);
