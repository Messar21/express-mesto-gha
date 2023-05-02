const httpStatus = require('http-status');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.BAD_REQUEST;
  }
}

module.exports = BadRequest;
