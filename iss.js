const request = require('request');
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json',(error, response, body)=>{
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/${ip}`, (error, response, body)=>{
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const result = {};
    result.latitude = JSON.parse(body).data.latitude;
    result.longitude = JSON.parse(body).data.longitude;
    callback(null, result);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const { latitude, longitude} = coords;
  request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`, (error, response, body)=>{
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Flyover Time. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const result = JSON.parse(body).response;
    callback(null, result);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip)=>{
    if(error) return callback(error, null);
    fetchCoordsByIP(ip, (error, coords)=>{
      if(error) return callback(error, null);
      fetchISSFlyOverTimes(coords, (error, dates)=>{
        if(error) return callback(error, null);
        callback(null, dates)
      })
    })
  })
}
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };