/**
 * Calculate points in direction with specified interval from position
 *
 * @param lat
 * @param lng
 * @param rotation
 * @param interval
 */
function getDataPoints (lat, lng, rotation, interval, repetitions,elevation){
    var dataPoints = [];
    for (var i = 0; i < repetitions; i++) {
        var point = {lat: -1, lng: -1, elv: -1};
        point.lat = parseFloat(lat) + i * Math.sin(rotation) * interval;
        point.lng = parseFloat(lng) + i * Math.cos(rotation) * interval;
        point.elv = elevation;
        dataPoints.push(point);
    }
    return dataPoints;
};

/**
 * Calculate height for data points based on tilt
 *
 * @param dataPoints
 * @param tilt
 * @param interval
 * @returns {Array}
 */
function elevateDataPoints (dataPoints, tilt, interval){
    var elevatedDataPoints = [];
    if(tilt > 15 ) tilt = 15
    if(tilt < -15) tilt = -15 
    tilt *= 6;
    console.debug(tilt);
    var tiltRadian = tilt * Math.PI / 180;
    for (var i = 0; i < dataPoints.length; i++) {
        var dataPoint = dataPoints[i];
        console.log(dataPoint.elv,(i*interval*6300)*(Math.tan(tiltRadian)));
        dataPoint.elv = dataPoint.elv + (i * interval*6300) * (Math.tan(tiltRadian));
        elevatedDataPoints.push(dataPoint);
    }
    return elevatedDataPoints;
};

module.exports = {
    getDataPoints,
    elevateDataPoints
}