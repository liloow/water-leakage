const request = require('request');
const data = require('./hourly_consumption.json');

(() => {
  let i = 0;
  const interval = setInterval(() => {
    const options = {
      method: 'POST',
      url: 'http://localhost:3000/',
      headers: {
        'Postman-Token': '920d4427-e117-4f0f-a334-c0a34070880f',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: [data[i]],
      json: true,
    };
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
    });
    i++;
    if (i === data.length) {
      clearInterval(interval);
      console.log('END OF INPUT');
    }
  }, 10000);
})();
