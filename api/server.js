// server.js

// BASE SETUP
// call the packages we need
var express    = require('express'),        // call express
    app        = express(),                 // define our app using express
    bodyParser = require('body-parser');

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


var Community = require('./models/community');
// on routes that end in /communities
// ----------------------------------------------------
router.route('/communities')
    // create a product (accessed at POST http://localhost:8080/api/v1/communities)
    .post(function(request, response) {
        var req = request.body.community;
        var community = new Community();      // create a new instance of the Community model
        community.name = req.name;
        community.code = req.code;

        // response.json({ message: 'Product created!' });
        // save the todo and check for errors
        community.save(function(error, community) {
            if (error)
                response.send(error);

            response.json({ community : community });
        });
    })

    // get all the todos (accessed at GET http://localhost:8080/api/v1/communities)
    .get(function (request, response) {
        Community.find(function (error, communities) {
            if (error) response.send(error);
            response.json({
                communities : communities
            });
        });
    });

router.route('/communities/:community_id')
    // get the product with that id (accessed at GET http://localhost:8080/api/communities/:community)
    .get(function (request, response) {
        Community.findById(request.params.community_id, function (error, community) {
            if (error) response.send(error);
            response.json({
                community : community
            });
        });
    })
    // update the community with this id (accessed at PUT http://localhost:8080/api/communities/:community_id)
    .put(function (request, response) {
        var req = request.body.community;
        // console.log("updating a commmunity");
        // console.log("id:", request.params.community_id);
        // console.log(request.body);

        // use our community model to find the community we want
        Community.findById(request.params.community_id, function(error, community) {
            if (error) response.send(error);

            // update the community info
            community.name = req.name;
            community.code = req.code;
            community.address1 = req.address1;
            community.address2 = req.address2;
            community.city = req.city;
            community.state = req.state;
            community.zip = req.zip;
            community.country = req.country;
            community.poc = req.poc;
            community.email = req.email;
            community.phone = req.phone;
            community.website = req.website;
            community.yearBuilt = req.yearBuilt;
            community.yearRenovated = req.yearRenovated;
            community.propertySize = req.propertySize;
            community.floors = req.floors;
            community.units = req.units;
            community.mgmtCompany = req.mgmtCompany;
            community.ownerCompany = req.ownerCompany;

            // save the community
            community.save(function(error, community) {
                if (error) response.send(error);
                response.json({ community : community });
            });
        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/api/communities/:community_id)
    .delete(function (request, response) {
        Community.remove({
            _id: request.params.community_id
        }, function(error, community) {
            if (error) res.send(err);

            response.json({});
        });
    });


var NewPricing = require('./models/new-pricing');
// on routes that end in /newPricings
// ----------------------------------------------------
router.route('/newPricings')
    // create a product (accessed at POST http://localhost:8080/api/v1/newPricings)
    .post(function(request, response) {
        var req = request.body.newPricing;
        var np = new NewPricing();      // create a new instance of the New Pricing model
        np.communityId      = req.communityId;
        np.unitNumber       = req.unitNumber;
        np.priceDate        = req.priceDate;
        np.unitType         = req.unitType;
        np.unitCategory     = req.unitCategory;
        np.status           = req.status;
        np.available        = req.available;
        np.moveout          = req.moveout;
        np.priorRent        = req.priorRent;
        np.sf               = req.sf;
        np.amenities        = req.amenities;
        np.pmsUnitType      = req.pmsUnitType;
        np.offset           = req.offset;
        np.amenityAmount    = req.amenityAmount;
        np.leaseTerm        = req.leaseTerm;
        np.baseRent         = req.baseRent;
        np.totalConcession  = req.totalConcession;
        np.effectiveRent    = req.effectiveRent;

        // response.json({ message: 'New Pricing created!' });
        // save the todo and check for errors
        np.save(function(error, newPricing) {
            if (error)
                response.send(error);

            response.json({ newPricing : newPricing });
        });
    })

    // get all the todos (accessed at GET http://localhost:8080/api/v1/newPricings)
    .get(function (request, response) {
        NewPricing.find(request.query, function (error, newPricings) {
            if (error) response.send(error);
            response.json({
                newPricings : newPricings
            });
        });
    });

router.route('/newPricings/:new_pricing_id')
    // get the product with that id (accessed at GET http://localhost:8080/api/newPricings/:new_pricing_id)
    .get(function (request, response) {
        NewPricing.findById(request.params.new_pricing_id, function (error, newPricing) {
            if (error) response.send(error);
            response.json({
                newPricing : newPricing
            });
        });
    })
    // update the community with this id (accessed at PUT http://localhost:8080/api/communities/:community_id)
    .put(function (request, response) {
        var req = request.body.newPricing;
        console.log("updating a newPricing");
        console.log("id:", request.params.new_pricing_id);
        console.log(request.body);

        // use our community model to find the community we want
        NewPricing.findById(request.params.new_pricing_id, function(error, newPricing) {
            if (error) response.send(error);

            // update the community info
            newPricing.community_id = req.community_id;
            newPricing.unit_id = req.unit_id;


            // save the community
            newPricing.save(function(error, newPricing) {
                if (error) response.send(error);
                response.json({ newPricing : newPricing });
            });
        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/api/communities/:community_id)
    .delete(function (request, response) {
        NewPricing.remove({
            _id: request.params.new_pricing_id
        }, function(error, newPricing) {
            if (error) res.send(err);

            response.json({});
        });
    });


var LeaseTerm = require('./models/lease-term');
// on routes that end in /leaseTerms
// ----------------------------------------------------
router.route('/leaseTerms')
    // create a product (accessed at POST http://localhost:8080/api/v1/leaseTerms)
    .post(function(request, response) {
        var req = request.body.leaseTerm;
        var lt = new LeaseTerm();      // create a new instance of the Lease Term model
        lt.term             = req.term;
        lt.baseRent         = req.baseRent;
        lt.totalConcession  = req.totalConcession;
        lt.effectiveRent    = req.effectiveRent;
        lt.newPricing       = req.newPricing;


        // response.json({ message: 'Lease Term created!' });
        // save the todo and check for errors
        lt.save(function(error, leaseTerm) {
            if (error)
                response.send(error);

            response.json({ leaseTerm : leaseTerm });
        });
    })

    // get all the todos (accessed at GET http://localhost:8080/api/v1/leaseTerms)
    .get(function (request, response) {
        LeaseTerm.find(request.query, function (error, leaseTerms) {
            if (error) response.send(error);
            response.json({
                leaseTerms : leaseTerms
            });
        });
    });

router.route('/leaseTerms/:leaseTerm_id')
    // get the product with that id (accessed at GET http://localhost:8080/api/newPricings/:new_pricing_id)
    .get(function (request, response) {
        LeaseTerm.findById(request.params.lease_term_id, function (error, leaseTerm) {
            if (error) response.send(error);
            response.json({
                leaseTerm : leaseTerm
            });
        });
    })
    // update the community with this id (accessed at PUT http://localhost:8080/api/communities/:community_id)
    .put(function (request, response) {
        var req = request.body.leaseTerm;
        // console.log("updating a leaseTerm");
        // console.log("id:", request.params.lease_term_id);
        // console.log(request.body);

        // use our community model to find the community we want
        LeaseTerm.findById(request.params.lease_term_id, function(error, leaseTerm) {
            if (error) response.send(error);

            // update the lease term info
            leaseTerm.term = req.term;
            leaseTerm.baseRent = req.baseRent;
            leaseTerm.totalConcession = req.totalConcession;
            leaseTerm.effectiveRent = req.effectiveRent;
            leaseTerm.newPricing = req.newPricing;

            // save the community
            leaseTerm.save(function(error, leaseTerm) {
                if (error) response.send(error);
                response.json({ leaseTerm: leaseTerm });
            });
        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/api/communities/:community_id)
    .delete(function (request, response) {
        LeaseTerm.remove({
            _id: request.params.lease_term_id
        }, function(error, leaseTerm) {
            if (error) res.send(err);

            response.json({});
        });
    });


var RenewalBatch = require('./models/renewal-batch');
// on routes that end in /renewalBatches
// ----------------------------------------------------
router.route('/renewalBatches')
    // create a product (accessed at POST http://localhost:8080/api/v1/renewalBatches)
    .post(function(request, response) {
        var req = request.body.renewalBatch;
        var newObj = new RenewalBatch();      // create a new instance of the Renewal Batch model
        newObj.name         = req.name;
        newObj.month        = req.month;
        newObj.status       = req.status;
        newObj.startDate    = req.startDate;
        newObj.endDate      = req.endDate;

        // response.json({ message: 'New Pricing created!' });
        // save the todo and check for errors
        newObj.save(function(error) {
            if (error)
                response.send(error);

            response.json({ renewalBatch: newObj });
        });
    })

    // get all the todos (accessed at GET http://localhost:8080/api/v1/renewalBatches)
    .get(function (request, response) {
        RenewalBatch.find(request.query, function (error, renewalBatches) {
            if (error) response.send(error);
            response.json({
                renewalBatches : renewalBatches
            });
        });
    });

router.route('/renewalBatches/:renewal_batch_id')
    // get the product with that id (accessed at GET http://localhost:8080/api/renewalBatches/:renewal_batch_id)
    .get(function (request, response) {
        RenewalBatch.findById(request.params.renewal_batch_id, function (error, renewalBatch) {
            if (error) response.send(error);
            response.json({
                renewalBatch : renewalBatch
            });
        });
    })
    // update the community with this id (accessed at PUT http://localhost:8080/api/communities/:community_id)
    .put(function (request, response) {
        var req = request.body.renewalBatch;
        console.log("updating a renewalBatch");
        console.log("id:", request.params.renewal_batch_id);
        console.log(request.body);

        // use our community model to find the community we want
        RenewalBatch.findById(request.params.renewal_batch_id, function(error, renewalBatch) {
            if (error) response.send(error);

            // update the community info
            renewalBatch.name = req.name;
            renewalBatch.status = req.status;

            // save the community
            renewalBatch.save(function(error) {
                if (error) response.send(error);
                response.json({ message: 'renewalBatch updated!' });
            });
        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/api/communities/:community_id)
    .delete(function (request, response) {
        RenewalBatch.remove({
            _id: request.params.renewal_batch_id
        }, function(error, renewalBatch) {
            if (error) res.send(err);

            response.json({ message: 'Successfully deleted' });
        });
    });


var RenewalComm = require('./models/renewal-comm');
// on routes that end in /renewalComms
// ----------------------------------------------------
router.route('/renewalComms')
    // create a product (accessed at POST http://localhost:8080/api/v1/renewalComms)
    .post(function(request, response) {
        var req = request.body.renewalComm;
        var newObj = new RenewalComm();      // create a new instance of the Renewal Batch model
        newObj.community    = req.community;
        newObj.batch        = req.batch;

        // response.json({ message: 'New Pricing created!' });
        // save the todo and check for errors
        newObj.save(function(error) {
            if (error)
                response.send(error);

            response.json({ renewalComm: newObj });
        });
    })

    // get all the todos (accessed at GET http://localhost:8080/api/v1/renewalComms)
    .get(function (request, response) {
        RenewalComm.find(request.query, function (error, renewalComms) {
            if (error) response.send(error);
            response.json({
                renewalComms : renewalComms
            });
        });
    });

router.route('/renewalComms/:renewal_comm_id')
    // get the product with that id (accessed at GET http://localhost:8080/api/renewalComms/:renewal_comm_id)
    .get(function (request, response) {
        RenewalComm.findById(request.params.renewal_comm_id, function (error, renewalComm) {
            if (error) response.send(error);
            response.json({
                renewalComm : renewalComm
            });
        });
    })
    // update the community with this id (accessed at PUT http://localhost:8080/api/communities/:community_id)
    .put(function (request, response) {
        var req = request.body.renewalComm;
        console.log("updating a renewalComm");
        console.log("id:", request.params.renewal_comm_id);
        console.log(request.body);

        // use our community model to find the community we want
        RenewalComm.findById(request.params.renewal_comm_id, function(error, renewalComm) {
            if (error) response.send(error);

            // update the community info
            renewalComm.community = req.community;
            renewalComm.batch = req.batch;

            // save the community
            renewalComm.save(function(error) {
                if (error) response.send(error, renewalComm);
                response.json({ renewalComm: renewalComm });
            });
        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/api/communities/:community_id)
    .delete(function (request, response) {
        RenewalComm.remove({
            _id: request.params.renewal_comm_id
        }, function(error, renewalComm) {
            if (error) res.send(err);

            response.json({});
        });
    });


var RenewalUnit = require('./models/renewal-unit');
// on routes that end in /renewalComms
// ----------------------------------------------------
router.route('/renewalUnits')
    // create a product (accessed at POST http://localhost:8080/api/v1/renewalUnits)
    .post(function(request, response) {
        var req = request.body.renewalUnit;
        var newObj = new RenewalUnit();      // create a new instance of the Renewal Batch model
        newObj.renewalComm          = req.renewalComm;
        newObj.batch                = req.batch;
        newObj.unitId               = req.unitId;
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
        newObj.overrideRent         = req.overrideRent;
        newObj.overrideLeaseTerm    = req.overrideLeaseTerm;

        // response.json({ message: 'New Pricing created!' });
        // save the todo and check for errors
        newObj.save(function(error) {
            if (error)
                response.send(error);

            response.json({ renewalUnit: newObj });
        });
    })

    // get all the todos (accessed at GET http://localhost:8080/api/v1/renewalUnits)
    .get(function (request, response) {
        RenewalUnit.find(request.query, function (error, renewalUnits) {
            if (error) response.send(error);
            response.json({
                renewalUnits : renewalUnits
            });
        });
    });

router.route('/renewalUnits/:renewal_unit_id')
    // get the product with that id (accessed at GET http://localhost:8080/api/renewalUnits/:renewal_unit_id)
    .get(function (request, response) {
        RenewalUnit.findById(request.params.renewal_unit_id, function (error, renewalUnit) {
            if (error) response.send(error);
            response.json({
                renewalUnit : renewalUnit
            });
        });
    })
    // update the community with this id (accessed at PUT http://localhost:8080/api/communities/:community_id)
    .put(function (request, response) {
        var req = request.body.renewalUnit;

        // use our community model to find the community we want
        RenewalUnit.findById(request.params.renewal_unit_id, function(error, renewalUnit) {
            if (error) response.send(error);

            // update the community info
            renewalUnit.renewalComm          = req.renewalComm;
            renewalUnit.batch                = req.batch;
            renewalUnit.unitId               = req.unitId;
            renewalUnit.unitType             = req.unitType;
            renewalUnit.pmsUnitType          = req.pmsUnitType;
            renewalUnit.beds                 = req.beds;
            renewalUnit.baths                = req.baths;
            renewalUnit.renewalDate          = req.renewalDate;
            renewalUnit.resident             = req.resident;
            renewalUnit.amenities            = req.amenities;
            renewalUnit.amenityAmount        = req.amenityAmount;
            renewalUnit.currentLeaseTerm     = req.currentLeaseTerm;
            renewalUnit.recLeaseTerm         = req.recLeaseTerm;
            renewalUnit.currentRent          = req.currentRent;
            renewalUnit.recRent              = req.recRent;
            renewalUnit.cmr                  = req.cmr;
            renewalUnit.approved             = req.approved;
            renewalUnit.notice               = req.notice;
            renewalUnit.renewed              = req.renewed;
            renewalUnit.undecided            = req.undecided;
            renewalUnit.overrideRent         = req.overrideRent;
            renewalUnit.overrideLeaseTerm    = req.overrideLeaseTerm;

            // save the community
            renewalUnit.save(function(error, renewalUnit) {
                if (error) response.send(error);
                response.json({ renewalUnit: renewalUnit });
            });
        });
    })

    // delete the product with this id (accessed at DELETE http://localhost:8080/api/communities/:community_id)
    .delete(function (request, response) {
        RenewalUnit.remove({
            _id: request.params.renewal_unit_id
        }, function(error, renewalUnit) {
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
