const httpStatus = require('http-status');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = httpStatus.CONFLICT;
  }
}

module.exports = ConflictError;
