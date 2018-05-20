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
                resolve(response.data.results[0].name)
            })
        }else{
            reject('Nothing found')
        }

      });
}

module.exports = {
    getPOIInfo
}