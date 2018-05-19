var express = require('express');
var axios = require('axios');
var app = express();
var pointer = require('./datapoints.js');
var altitude = require('./altitude.js');
var poi = require('./poi.js');


app.get('/getLocationInfo', function (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var tilt = req.query.tilt;
    var rotation = req.query.rotation;
    altitude.getAltitude([{
        lat:lat,
        lng:lng
    }]).then(function(myAltitude){
        var dataPoints = pointer.getDataPoints(lat, lng, rotation, interval, repetitions);
        dataPoints = pointer.elevateDataPoints(dataPoints, tilt, interval, myAltitude);
        res.send(altitude.getIntersection(location,dataPoints).then(function(pois){
            res.send(pois.results[0].name)
        }));
    })    
});



var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("Example app listening at http://%s:%s", host, port);
});