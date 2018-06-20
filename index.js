var express = require('express');
var firebase = require('firebase');
var app = express();
var pointer = require('./datapoints.js');
var altitude = require('./altitude.js');
var poi = require('./poi.js');
var fs = require('fs');
var handlebars = require('handlebars');

firebase.initializeApp({
    apiKey: "AIzaSyDLHlyQ60KyWysYAbPMRUbDrMSCuuZNTDo",
    authDomain: "farmnet-729b5.firebaseapp.com",
    databaseURL: "https://farmnet-729b5.firebaseio.com",
    projectId: "farmnet-729b5",
    storageBucket: "farmnet-729b5.appspot.com",
    messagingSenderId: "308731826632"
  });
var fbase = firebase.database().ref('/');

app.get("/", function (req, res) {
    res.send("<h1>Point Out - landing page, we shot nerf bullets agains unauthenticated users</h1>");
});


app.get('/beamMeUpScotty', function(req,res){
    var name = req.query.name;
    var device = req.query.device;
    var light = req.query.light;
    var user = {}
    user[name]={
        device:device,
        light:light
    };
    firebase.database().ref('/' + name).set({
        device: device,
      });
    res.send({
        status:'ok',
        message:'Boo yah! Your up'
    })
});

app.get('/app/:slug', function(req,res){    
    var slug =[req.params.slug][0];                    
    fbase.on("value", function(snapshot){
        var source = fs.readFileSync(slug, "utf8"); // bring in the HTML file
        var template = handlebars.compile(source); // replace all of the data
        var html = template({
            comments:snapshot.val(),
            length:Object.keys(snapshot.val()).length
        })
        console.log(snapshot.val());
        res.send(html); // send to client
        fbase.off()
    });

});


app.get('/getLocationInfo', function (req, res) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var tilt = req.query.tilt;
    var rotation = ((req.query.rotation*-1) * Math.PI / 180)+Math.PI/2
    var interval = 0.0001;
    console.log(lat,lng,tilt,rotation,interval)
    altitude.getAltitude([{
        lat:lat,
        lng:lng
    }]).then(function(myAltitude){
        console.debug('My altitude',myAltitude.data.results[0].elevation)
        increaseInterval(res,interval,lat,lng,tilt,rotation,parseInt(myAltitude.data.results[0].elevation)+10)
    })    
});



function increaseInterval(res,interval,lat,lng,tilt,rotation,myAltitude){
    if(interval < 6.5){
        var dataPoints = pointer.getDataPoints(lat, lng, rotation, interval, 100,myAltitude);
        dataPoints = pointer.elevateDataPoints(dataPoints, tilt, interval, myAltitude);
        //uncomment for maps debugger
        //res.send(dataPoints)
        altitude.getIntersection(dataPoints).then(function(response){
            res.send({
                status:'success',
                place: response.names,
                location: response.location,
                markerText: response.mainName
            });
        }).catch(function(error){
            interval *= 5
            console.log('Range increase',interval)
            increaseInterval(res,interval,lat,lng,tilt,rotation,myAltitude);  
        })
    }else{
        res.send({
            status: 'rocket',
            message: "It didn't failed, it didn't work either, try to be more realistic. Not everyone can be Elon Musk"
        })
    }
    
}

var port = process.env.PORT || 8081; 
var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});