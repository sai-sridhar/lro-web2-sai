// server.js

// BASE SETUP
// call the packages we need
var express    = require('express'),        // call express
    app        = express(),                 // define our app using express
    bodyParser = require('body-parser'),
    moment     = require('moment');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Add CORS headers
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "http://localhost:4200");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Allow-Resource", "*");
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

var port = process.env.PORT || 8081;        // set our port

var mongoose	= require('mongoose');
var ObjectId  = mongoose.Types.ObjectId;
var url 		= 'mongodb://api-user:letitrain@ds061345.mongolab.com:61345/rmg-lro-zion';
// var url = 'mongodb://localhost/rmg_prod_mgmt';
mongoose.connect(url); // connect to our database
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected!");
});


// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(request, response) {
    response.json({ message: 'hooray! welcome to the LRO Zion api!' });
});

router.post('/token', function(request, response) {
    if( request.body.grant_type === 'password') {
        if( request.body.username === 'jtrkovsky@letitrain.com' && request.body.password === 'rain' ) {
            response.status(200).send('{ "access_token" : "secret token" }');
        } else {
            response.status(400).send('{ "error" : "invalid_grant" }');
        }
    } else {
        response.status(400).send('{ "error" : "unsupported_grant_type" }');
    }
});

// Get all the models
var Community = require('./models/community'),
    NewPricing = require('./models/new-pricing'),
    LeaseTerm = require('./models/lease-term'),
    RenewalBatch = require('./models/renewal-batch'),
    RenewalComm = require('./models/renewal-comm'),
    RenewalUnit = require('./models/renewal-unit'),
    Unit = require('./models/unit');


// on routes that end in /communities
// ----------------------------------------------------
router.route('/communities')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.community,
            newObj = new Community();

        newObj.name = req.name;
        newObj.code = req.code;
        newObj.address1 = req.address1;
        newObj.address2 = req.address2;
        newObj.city = req.city;
        newObj.state = req.state;
        newObj.zip = req.zip;
        newObj.country = req.country;
        newObj.poc = req.poc;
        newObj.email = req.email;
        newObj.phone = req.phone;
        newObj.website = req.website;
        newObj.yearBuilt = req.yearBuilt;
        newObj.yearRenovated = req.yearRenovated;
        newObj.propertySize = req.propertySize;
        newObj.floors = req.floors;
        newObj.units = req.units;
        newObj.mgmtCompany = req.mgmtCompany;
        newObj.ownerCompany = req.ownerCompany;

        // save the new object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({
                community : newObj
            });
        });
    })

    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        Community.find(function (error, objs) {
            if (error) response.send(error);
            response.json({
                communities : objs
            });
        });
    });

router.route('/communities/:community_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/objects/:object_id)
    .get(function (request, response) {
        Community.findById(request.params.community_id, function (error, obj) {
            if (error) response.send(error);
            response.json({
                community : obj
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.community;

        // use our model to find the object we want
        Community.findById(request.params.community_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.name = req.name;
            obj.code = req.code;
            obj.address1 = req.address1;
            obj.address2 = req.address2;
            obj.city = req.city;
            obj.state = req.state;
            obj.zip = req.zip;
            obj.country = req.country;
            obj.poc = req.poc;
            obj.email = req.email;
            obj.phone = req.phone;
            obj.website = req.website;
            obj.yearBuilt = req.yearBuilt;
            obj.yearRenovated = req.yearRenovated;
            obj.propertySize = req.propertySize;
            obj.floors = req.floors;
            obj.units = req.units;
            obj.mgmtCompany = req.mgmtCompany;
            obj.ownerCompany = req.ownerCompany;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error);
                response.json({
                    community : obj
                });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:objects_id)
    .delete(function (request, response) {
        Community.remove({
            _id: request.params.community_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// on routes that end in /newPricings
// ----------------------------------------------------
router.route('/newPricings')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.newPricing,
            newObj = new NewPricing();

        newObj.community        = req.community;
        newObj.unitNumber       = req.unitNumber;
        newObj.priceDate        = req.priceDate;
        newObj.unitType         = req.unitType;
        newObj.unitCategory     = req.unitCategory;
        newObj.status           = req.status;
        newObj.available        = req.available;
        newObj.moveout          = req.moveout;
        newObj.priorRent        = req.priorRent;
        newObj.sf               = req.sf;
        newObj.amenities        = req.amenities;
        newObj.pmsUnitType      = req.pmsUnitType;
        newObj.offset           = req.offset;
        newObj.amenityAmount    = req.amenityAmount;
        newObj.leaseTerm        = req.leaseTerm;
        newObj.baseRent         = req.baseRent;
        newObj.totalConcession  = req.totalConcession;
        newObj.effectiveRent    = req.effectiveRent;

        // save the object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({
                newPricing : newObj
            });
        });
    })
    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        console.log(request.query);
        NewPricing.find(request.query, function (error, objs) {
            if (error) response.send(error);
            response.json({
                newPricings : objs
            });
        });
    });

router.route('/newPricings/:new_pricing_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/object/:object_id)
    .get(function (request, response) {
        var query = new ObjectId(request.params.new_pricing_id);

        NewPricing.findById(request.params.new_pricing_id, function (error, newPricing) {
            if (error) response.send(error);

            LeaseTerm.find({newPricing : query}, "_id", function (error, leaseTerms) {
                if (error) response.send(error);
                for( i = 0; i < leaseTerms.length; i++ ) {
                    newPricing.leaseTerms.push(leaseTerms[i]["_id"]);
                }

                response.json({
                    newPricing : newPricing
                });
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.newPricing;

        // use our model to find the object we want
        NewPricing.findById(request.params.new_pricing_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.community_id = req.community_id;
            obj.unit_id = req.unit_id;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error);
                response.json({ newPricing : obj });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:object_id)
    .delete(function (request, response) {
        NewPricing.remove({
            _id: request.params.new_pricing_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// on routes that end in /leaseTerms
// ----------------------------------------------------
router.route('/leaseTerms')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.leaseTerm,
            newObj = new LeaseTerm();
        newObj.term             = req.term;
        newObj.baseRent         = req.baseRent;
        newObj.totalConcession  = req.totalConcession;
        newObj.effectiveRent    = req.effectiveRent;
        newObj.newPricing       = req.newPricing;

        // save the object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({
                leaseTerm : newObj
            });
        });
    })

    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        LeaseTerm.find(request.query, function (error, objs) {
            if (error) response.send(error);
            response.json({
                leaseTerms : objs
            });
        });
    });

router.route('/leaseTerms/:lease_term_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/objects/:object_id)
    .get(function (request, response) {
        LeaseTerm.findById(request.params.lease_term_id, function (error, obj) {
            if (error) response.send(error);
            response.json({
                leaseTerm : obj
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.leaseTerm;

        // use our model to find the object we want
        LeaseTerm.findById(request.params.lease_term_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.term = req.term;
            obj.baseRent = req.baseRent;
            obj.totalConcession = req.totalConcession;
            obj.effectiveRent = req.effectiveRent;
            obj.newPricing = req.newPricing;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error);
                response.json({
                    leaseTerm: obj });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:object_id)
    .delete(function (request, response) {
        LeaseTerm.remove({
            _id: request.params.lease_term_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// on routes that end in /renewalBatches
// ----------------------------------------------------
router.route('/renewalBatches')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.renewalBatch,
            newObj = new RenewalBatch();
        newObj.name         = req.name;
        newObj.month        = req.month;
        newObj.status       = req.status;
        newObj.startDate    = req.startDate;
        newObj.endDate      = req.endDate;

        // save the object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({
                renewalBatch: newObj
            });
        });
    })
    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        RenewalBatch.find(request.query, function (error, objs) {
            if (error) response.send(error);
            response.json({
                renewalBatches : objs
            });
        });
    });

router.route('/renewalBatches/:renewal_batch_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/objects/:object_id)
    .get(function (request, response) {
        var query = new ObjectId(request.params.renewal_batch_id);

        RenewalBatch.findById(request.params.renewal_batch_id, function (error, renewalBatch) {
            if (error) response.send(error);

            RenewalComm.find({batch : query}, "_id", function (error, comms) {
                if (error) response.send(error);
                for( i = 0; i < comms.length; i++ ) {
                    renewalBatch.communities.push(comms[i]["_id"]);
                }

                response.json({
                    renewalBatch : renewalBatch
                });
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.renewalBatch;

        // use our model to find the object we want
        RenewalBatch.findById(request.params.renewal_batch_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.name = req.name;
            obj.status = req.status;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error);
                response.json({
                    renewalBatch: obj
                });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:object_id)
    .delete(function (request, response) {
        RenewalBatch.remove({
            _id: request.params.renewal_batch_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// on routes that end in /renewalComms
// ----------------------------------------------------
router.route('/renewalComms')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.renewalComm,
            newObj = new RenewalComm();
        newObj.community    = req.community;
        newObj.batch        = req.batch;

        // save the object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({
                renewalComm: newObj
            });
        });
    })
    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        RenewalComm.find(request.query, function (error, objs) {
            if (error) response.send(error);
            response.json({
                renewalComms : objs
            });
        });
    });

router.route('/renewalComms/:renewal_comm_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/objects/:object_id)
    .get(function (request, response) {
        var query = new ObjectId(request.params.renewal_comm_id);

        RenewalComm.findById(request.params.renewal_comm_id, function (error, renewalComm) {
            if (error) response.send(error);

            RenewalUnit.find({renewalComm : query}, "_id", function (error, units) {
                if (error) response.send(error);
                for( i = 0; i < units.length; i++ ) {
                    renewalComm.units.push(units[i]["_id"]);
                }

                response.json({
                    renewalComm : renewalComm
                });
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.renewalComm;

        // use our model to find the object we want
        RenewalComm.findById(request.params.renewal_comm_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.community = req.community;
            obj.batch = req.batch;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error, obj);
                response.json({
                    renewalComm: obj
                });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:object_id)
    .delete(function (request, response) {
        RenewalComm.remove({
            _id: request.params.renewal_comm_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// on routes that end in /renewalComms
// ----------------------------------------------------
router.route('/renewalUnits')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.renewalUnit,
            newObj = new RenewalUnit();

        newObj.community            = req.community;
        newObj.renewalComm            = req.renewalComm;
        newObj.batch                = req.batch;
        newObj.unitNumber           = req.unitNumber;
        newObj.unitType             = req.unitType;
        newObj.pmsUnitType          = req.pmsUnitType;
        newObj.beds                 = req.beds;
        newObj.baths                = req.baths;
        newObj.renewalDate          = req.renewalDate;
        newObj.resident             = req.resident;
        newObj.amenities            = req.amenities;
        newObj.amenityAmount        = req.amenityAmount;
        newObj.currentLeaseTerm     = req.currentLeaseTerm;
        newObj.recLeaseTerm         = req.recLeaseTerm;
        newObj.currentRent          = req.currentRent;
        newObj.recRent              = req.recRent;
        newObj.cmr                  = req.cmr;
        newObj.approved             = req.approved;
        newObj.notice               = req.notice;
        newObj.renewed              = req.renewed;
        newObj.undecided            = req.undecided;
        newObj.userOverridePct      = req.userOverridePct;
        newObj.userOverrideDollars  = req.userOverrideDollars;
        newObj.userOverrideMode     = req.userOverrideMode;
        newObj.finalRecRent         = req.finalRecRent;

        // save the object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({ renewalUnit: newObj });
        });
    })
    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        RenewalUnit.find(request.query, function (error, objs) {
            if (error) response.send(error);
            response.json({
                renewalUnits : objs
            });
        });
    });

router.route('/renewalUnits/:renewal_unit_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/objects/:object_id)
    .get(function (request, response) {
        RenewalUnit.findById(request.params.renewal_unit_id, function (error, obj) {
            if (error) response.send(error);
            response.json({
                renewalUnit : obj
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.renewalUnit;

        // use our model to find the object we want
        RenewalUnit.findById(request.params.renewal_unit_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.renewalComm          = req.renewalComm;
            obj.batch                = req.batch;
            obj.unitNumber            = req.unitNumber;
            obj.unitType             = req.unitType;
            obj.pmsUnitType          = req.pmsUnitType;
            obj.beds                 = req.beds;
            obj.baths                = req.baths;
            obj.renewalDate          = req.renewalDate;
            obj.resident             = req.resident;
            obj.amenities            = req.amenities;
            obj.amenityAmount        = req.amenityAmount;
            obj.currentLeaseTerm     = req.currentLeaseTerm;
            obj.recLeaseTerm         = req.recLeaseTerm;
            obj.currentRent          = req.currentRent;
            obj.recRent              = req.recRent;
            obj.cmr                  = req.cmr;
            obj.approved             = req.approved;
            obj.notice               = req.notice;
            obj.renewed              = req.renewed;
            obj.undecided            = req.undecided;
            obj.userOverridePct      = req.userOverridePct;
            obj.userOverrideDollars  = req.userOverrideDollars;
            obj.userOverrideMode     = req.userOverrideMode;
            obj.finalRecRent         = req.finalRecRent;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error);
                response.json({
                    renewalUnit: obj
                });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:object_id)
    .delete(function (request, response) {
        RenewalUnit.remove({
            _id: request.params.renewal_unit_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// on routes that end in /units
// ----------------------------------------------------
router.route('/units')
    // create a new object (accessed at POST http://localhost:8080/api/v1/objects)
    .post(function(request, response) {
        var req = request.body.unit,
            newObj = new Unit();

        newObj.unitNumber           = req.unitNumber;
        newObj.community            = req.community;
        newObj.unitType             = req.unitType;
        newObj.unitCategory         = req.unitCategory;
        newObj.pmsUnitType          = req.pmsUnitType;
        newObj.beds                 = req.beds;
        newObj.baths                = req.baths;
        newObj.status               = req.status;
        newObj.cmr                  = req.cmr;
        newObj.leaseStartDate       = req.leaseStartDate;
        newObj.leaseExpirationDate  = req.leaseExpirationDate;
        newObj.leaseCurrentRent     = req.leaseCurrentRent;
        newObj.leaseCurrentTerm     = req.leaseCurrentTerm;
        newObj.leaseCurrentResident  = req.leaseCurrentResident;

        // save the object and check for errors
        newObj.save(function(error) {
            if (error) response.send(error);
            response.json({
                unit: newObj
            });
        });
    })
    // get all the objects (accessed at GET http://localhost:8080/api/v1/objects)
    .get(function (request, response) {
        var query = request.query;

        if( request.query.endDate && request.query.startDate && request.query.community )  {
            query = {
                community : request.query.community,
                leaseExpirationDate : { $lte : new Date(request.query.endDate), $gte : new Date(request.query.startDate) }
            };
        }

        Unit.find(query, function (error, objs) {
            if (error) response.send(error);
            response.json({
                units : objs
            });
        });
    });

router.route('/units/:unit_id')
    // get the object with that id (accessed at GET http://localhost:8080/api/objects/:object_id)
    .get(function (request, response) {
        Unit.findById(request.params.unit_id, function (error, obj) {
            if (error) response.send(error);
            response.json({
                unit : obj
            });
        });
    })
    // update the object with this id (accessed at PUT http://localhost:8080/api/objects/:object_id)
    .put(function (request, response) {
        var req = request.body.unit;

        // use our model to find the object we want
        Unit.findById(request.params.unit_id, function(error, obj) {
            if (error) response.send(error);

            // update the object info
            obj.unitNumber           = req.unitNumber;
            obj.community            = req.community;
            obj.unitType             = req.unitType;
            obj.unitCategory         = req.unitCategory;
            obj.pmsUnitType          = req.pmsUnitType;
            obj.beds                 = req.beds;
            obj.baths                = req.baths;
            obj.status               = req.status;
            obj.cmr                  = req.cmr;
            obj.leaseExpirationDate  = req.leaseExpirationDate;
            obj.leaseStartDate       = req.leaseStartDate;
            obj.leaseEndDate         = req.leaseEndDate;
            obj.leaseCurrentRent     = req.leaseCurrentRent;
            obj.leaseCurrentTerm     = req.leaseCurrentTerm;
            obj.leaseCurentResident  = req.leaseCurentResident;

            // save the object
            obj.save(function(error) {
                if (error) response.send(error);
                response.json({
                    unit : obj
                });
            });
        });
    })
    // delete the object with this id (accessed at DELETE http://localhost:8080/api/objects/:object_id)
    .delete(function (request, response) {
        Unit.remove({
            _id: request.params.unit_id
        }, function(error, obj) {
            if (error) res.send(err);
            response.json({});
        });
    });


// REGISTER OUR ROUTES
// all of our routes will be prefixed with /api/v1
app.use('/api/v1/', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
