var axios = require('axios')
function getPOIInfo(location){
    var googleMapsApiKey = 'AIzaSyBHqsqEggVja_XViZhOD6lger6d8Nn7Fso'
    return new Promise(function(resolve, reject) {
        if(location){
            axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json',{params: {
                key: googleMapsApiKey,
                location: location.lat+', '+location.lng,
                radius:100
            }}).then(function(response){
                var points = []
                for (var i=0;i<response.data.results.length;i++){
                    points.push(response.data.results[i].name)    
                }
                console.log(points)
                resolve(points.join(','))
                
            })
        }else{
            reject('Nothing found')
        }

      });
}

module.exports = {
    getPOIInfo
}