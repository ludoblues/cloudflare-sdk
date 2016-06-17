const request = require('request');

const baseUrl = "https://api.cloudflare.com/client/v4/";

module.exports = class Cloudflare {
  constructor(options) {
    this.email = options.email;
    this.key = options.key;
  }

  getZones() {
    const options = {
      uri: 'zones',
      method: 'GET',
      qs: {
        status: 'active'
      }
    };

    return this.send(options);
  }

  deleteCache(zoneId) {
    const options = {
      uri: `zones/${zoneId}/purge_cache`,
      method: 'DELETE',
      body: JSON.stringify({
        purge_everything: true
      })
    };

    return this.send(options);
  }

  send(options) {
    return new Promise( (resolve, reject) => {
      options.baseUrl = baseUrl;

      options.headers = {
        'X-Auth-Email': this.email,
        'X-Auth-Key': this.key,
        "Content-Type": 'application/json'
      }

      request(options, function (error, response, body) {
        (error || response.statusCode >= 400) ? reject(error) : resolve(JSON.parse(body));
      });
    });
  }
};
