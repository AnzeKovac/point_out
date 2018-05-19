var poi = require('./poi.js')
function getAltitude(dataPoints) {
    var googleMapsApiKey = 'AIzaSyDIc30sNBCP3G4XbxqR6ah7v07Ke8WXEnI'
    return axios.get('https://maps.googleapis.com/maps/api/elevation/json',{params: {
        key: googleMapsApiKey,
        locations: getLocationsPipe(dataPoints)
    }})
}

function getLocationsPipe(dataPoints){
    var locations = []
    for (var dataPoint in dataPoints){
        locations.push(dataPoint.lat + ', '+dataPoint.lng);
    }
    return locations.join('|')
}

function getIntersection(dataPoints){
    getAltitude([dataPoints]).then(function (altitudeResponses) {
        var actualAltitudes = altitudeResponses.result ? altitudeResponses.result : []
        if(altitudeResponses.results){
            for(var i=0;i<actualAltitudes.length;i++){
                var actualAltitude = actualAltitudes[i].elevation;
                var calculatedAltitude = dataPoints[i].elv
                if(actualAltitude>calculatedAltitude){
                    return poi.getPOIInfo(dataPoints[i])
                }
            }
        }
        
    })
    .catch(function (error) {
        console.log(error);
    });
}


module.exports = {
    getAltitude
}