const httpStatus = require('http-status');

class Unauthorised extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.UNAUTHORIZED;
  }
}

module.exports = Unauthorised;
