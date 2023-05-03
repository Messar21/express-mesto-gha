const httpStatus = require('http-status');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
