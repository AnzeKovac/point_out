var express = require('express');
var axios = require('axios')
var app = express();

app.get('/getLocationInfo', function (req, res) {
    axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json',{params: {
        key: 'AIzaSyDIc30sNBCP3G4XbxqR6ah7v07Ke8WXEnI',
        location: '46.061117, 14.476099',
        radius: 100
    }})
    .then(function (locationInfo) {
        axios.get('https://maps.googleapis.com/maps/api/elevation/json',{params: {
            key: 'AIzaSyDIc30sNBCP3G4XbxqR6ah7v07Ke8WXEnI',
            locations: '46.061117, 14.476099'
        }})
        .then(function (elevation) {
            var retObject = {
                city:locationInfo.data.results[0].name, 
                elevation:elevation.data.results[0].elevation
            }
            res.send(retObject);   
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    .catch(function (error) {
        console.log(error);
    });

    
    

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})