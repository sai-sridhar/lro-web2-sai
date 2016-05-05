var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modelSchema = new Schema({
    community 	: { type : Schema.ObjectId, ref : 'communities' },
    batch		: { type : Schema.ObjectId, ref : 'renewalbatches' },
    units		: []
});

module.exports = mongoose.model('RenewalComm', modelSchema);
