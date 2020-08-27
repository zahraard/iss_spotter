const { nextISSTimesForMyLocation } = require('./iss_promised');


nextISSTimesForMyLocation().then(data => {
  for(let passTime of data){
    const datetime = new Date(0);
    datetime.setUTCSeconds(passTime.risetime);
    const duration = passTime.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
}).catch((error) => {
  console.log("It didn't work: ", error.message);
});


