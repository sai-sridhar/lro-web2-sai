var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    unitNumber : String,
    community : String,
    unitType : String,
    unitCategory : String,
    pmsUnitType : String,
    status : String,
    beds : Number,
    baths : Number,
    cmr : Number,
    leaseStartDate : Date,
    leaseExpirationDate : Date,
    leaseCurrentRent : Number,
    leaseCurrentTerm : Number,
    leaseCurrentResident : String
});

module.exports = mongoose.model('Unit', modelSchema);
