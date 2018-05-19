function getPOIInfo(location){
    var googleMapsApiKey = 'AIzaSyDIc30sNBCP3G4XbxqR6ah7v07Ke8WXEnI'
    return new Promise(function(resolve, reject) {
        https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=46.160720,%2014.964228&radius=10

        return axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json',{params: {
            key: googleMapsApiKey,
            location: location.lat+', '+location.lng,
            radius:100
        }})
      });
}

module.exports = {
    getPOIInfo
}