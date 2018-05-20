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
    var rotation = req.query.rotation * Math.PI / 180;
    var interval = 0.0001;

    altitude.getAltitude([{
        lat:lat,
        lng:lng
    }]).then(function(myAltitude){
        console.debug(myAltitude.data.results[0].elevation)
        increaseInterval(res,interval,lat,lng,tilt,rotation,parseInt(myAltitude.data.results[0].elevation)+10)
    })    
});

function increaseInterval(res,interval,lat,lng,tilt,rotation,myAltitude){
    if(interval < 6.5){
        var dataPoints = pointer.getDataPoints(lat, lng, rotation, interval, 100,myAltitude);
        dataPoints = pointer.elevateDataPoints(dataPoints, tilt, interval, myAltitude);
        res.send(dataPoints);
        altitude.getIntersection(dataPoints).then(function(response){
            res.send(response);
        }).catch(function(error){
            interval *= 5
            console.log('Range increase',interval)
            increaseInterval(res,interval,lat,lng,tilt,rotation,myAltitude);  
        })
    }else{
        res.send('Nothing found')
    }
    
}

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});