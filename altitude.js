var poi = require('./poi.js')
var axios = require('axios');
function getAltitude(dataPoints) {
    console.debug(dataPoints)
    return new Promise(function(resolve,reject){
        var googleMapsApiKey = 'AIzaSyDIc30sNBCP3G4XbxqR6ah7v07Ke8WXEnI'
        var locationsPipe = getLocationsPipe(dataPoints);
        return axios.get('https://maps.googleapis.com/maps/api/elevation/json',{params: {
            key: googleMapsApiKey,
            locations: getLocationsPipe(dataPoints)
        }}).then(function(response){
            resolve(response)
        }).catch(function(error){
            reject(error)
        })
    })
}

function getLocationsPipe(dataPoints){
    var locations = []
    for (var i=0;i<dataPoints.length;i++){
        locations.push(dataPoints[i].lat + ','+dataPoints[i].lng);
    }
    return locations.join('|')
}

function getIntersection(dataPoints,res){
    getAltitude([dataPoints]).then(function (altitudeResponses) {
        console.debug(altitudeResponses)
        var actualAltitudes = altitudeResponses.results ? altitudeResponses.results : []
        if(altitudeResponses.results){
            for(var i=0;i<actualAltitudes.length;i++){
                var actualAltitude = actualAltitudes[i].elevation;
                var calculatedAltitude = dataPoints[i].elv
                console .debug(actualAltitude,calculatedAltitude)
                if(actualAltitude>calculatedAltitude){
                    res.send(poi.getPOIInfo(dataPoints[i]))
                }
            }
        }
    })
    .catch(function (error) {
        
    });
}


module.exports = {
    getAltitude,
    getIntersection
}