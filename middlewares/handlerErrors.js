const httpStatus = require('http-status');

// eslint-disable-next-line no-unused-vars
const handlerErrors = (err, req, res, next) => {
  const { statusCode = httpStatus.INTERNAL_SERVER_ERROR, message } = err;
  return res
    .status(statusCode)
    .send({
      message: statusCode === httpStatus.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = { handlerErrors };
