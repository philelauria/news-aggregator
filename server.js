// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var moment = require('moment');

    // configuration =================

    mongoose.connect('mongodb://rohanagrawal:temppw@proximus.modulusmongo.net:27017/siziw2Ox');     // connect to mongoDB database on modulus.io
    // mongo console: mongo proximus.modulusmongo.net:27017/siziw2Ox -u <user> -p <pass>

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model =================
    var Interest = mongoose.model('Interest', {
        text : String,
        priority: String,
    });

    var currentDate = moment().format('dddd');


    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all interests
    app.get('/api/interests', function(req, res) {

        // use mongoose to get all interests in the database
        Interest.find(function(err, interests) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(interests); // return all interests in JSON format
        });
    });

    // create interest and send back all interests after creation
    app.post('/api/interests', function(req, res) {

        // create an interest, information comes from AJAX request from Angular
        Interest.create({
            text : req.body.text,
            priority: req.body.priority,
            done : false
        }, function(err, interest) {
            if (err)
                res.send(err);

            // get and return all the interests after you create another
            Interest.find(function(err, interests) {
                if (err)
                    res.send(err)
                res.json(interests);
            });
        });

    });

    // delete an interest
    app.delete('/api/interests/:interest_id', function(req, res) {
        Interest.remove({
            _id : req.params.interest_id
        }, function(err, interest) {
            if (err)
                res.send(err);

            // get and return all the interests after you create another
            Interest.find(function(err, interests) {
                if (err)
                    res.send(err)
                res.json(interests);
            });
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");