const httpStatus = require('http-status');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.NOT_FOUND;
  }
}

module.exports = NotFoundError;
