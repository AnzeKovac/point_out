var poi = require('./poi.js')
var axios = require('axios');
function getAltitude(dataPoints) {
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

function getIntersection(dataPoints){
    return new Promise(function(resolve,reject){
        getAltitude(dataPoints).then(function (altitudeResponses) {
            var actualAltitudes = altitudeResponses.data.results ? altitudeResponses.data.results : []
            var valueToCheck = undefined;
            if(actualAltitudes){
                for(var i=0;i<actualAltitudes.length;i++){
                    var actualAltitude = actualAltitudes[i].elevation;
                    var calculatedAltitude = dataPoints[i].elv
                    //console .debug(actualAltitude,calculatedAltitude)
                    if(actualAltitude>calculatedAltitude){
                        valueToCheck = dataPoints[i]
                        break;
                        
                    }
                }
                if(valueToCheck == undefined){
                    reject('Nothing found')
                }
                console.debug('Get INFO for',valueToCheck); 
                console.debug('https://www.google.com/maps/search/'+valueToCheck.lat+'%2C'+valueToCheck.lng)
                poi.getPOIInfo(valueToCheck).then(function(response){
                    resolve(response)
                }).catch(function(error){
                    console.log(error)
                })
            }
        })
        .catch(function (error) { 
            reject('No cross found')
        });
    })
    
}


module.exports = {
    getAltitude,
    getIntersection
}