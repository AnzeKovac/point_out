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
                var mainPoint = ''
                for (var i=0;i<response.data.results.length;i++){
                    if(i<4){
                        points.push(response.data.results[i].name)    
                        if(i==0){
                            mainPoint = response.data.results[0].name
                        }
                    }
                }
                console.log(points)
                resolve({
                    names:points.join(','),
                    location:location,
                    mainName:mainPoint
                })
                
            })
        }else{
            reject('Nothing found')
        }

      });
}

module.exports = {
    getPOIInfo
}