var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    name: String,
    code : String,
    address1 : String,
	address2 : String,
	city : String,
	state : String,
	zip : String,
	country : String,
	poc : String,
	email : String,
	phone : String,
	website : String,
	yearBuilt : Number,
	yearRenovated : Number,
	propertySize : Number,
	floors : Number,
	units : Number,
	mgmtCompany : String,
	ownerCompany : String,
});

module.exports = mongoose.model('Community', modelSchema);
