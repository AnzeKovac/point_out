var express = require('express');
var app = express();
var pointer = require('./datapoints.js');
var altitude = require('./altitude.js');
var poi = require('./poi.js');

app.get("/", function (req, res) {
    res.send("<h1>Point Out - landing page -- hello world</h1>");
});

app.get('/getLocationInfo', function (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var tilt = req.query.tilt;
    var rotation = req.query.rotation;
    var interval = 0.01;

    altitude.getAltitude([{
        lat:lat,
        lng:lng
    }]).then(function(myAltitude){
        console.debug(myAltitude)
        var dataPoints = pointer.getDataPoints(lat, lng, rotation, interval, 1);
        dataPoints = pointer.elevateDataPoints(dataPoints, tilt, interval, myAltitude);
        altitude.getIntersection(dataPoints)
        //while(interval < 6.5){
            //increaseInterval(res,interval,lat,lng,tilt,rotation,interval,myAltitude)
       // }
    })    
});


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});