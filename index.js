var express = require('express');
var axios = require('axios')
var app = express();
var pointer = require('./datapoints.js')
var altitude = require('./altitude.js')
var poi = require('./poi.js')


app.get('/getLocationInfo', function (req, res) {
    var location = req.query.location;
    var tilt = req.query.tilt;
    var rotation = req.query.rotation;

    var dataPoints = pointer.getDataPoints(location,rotation,interval);
    dataPoints = pointer.elevateDataPoints(dataPoints,tilt,interval);
    
    res.send(altitude.getIntersection(location,dataPoints))
})



var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})