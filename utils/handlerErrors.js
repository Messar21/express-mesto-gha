const mongoose = require('mongoose');
const httpStatus = require('http-status');

const handlerCardsErrors = (res, err) => {
  if (err instanceof mongoose.Error.ValidationError
    || err instanceof mongoose.Error.CastError) {
    return res.status(httpStatus.BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные карточки.' });
  }
  if (err.name === 'notFound') {
    return res.status(httpStatus.NOT_FOUND)
      .send({ message: 'Карточка с указаным _id не найдена.' });
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};

const handlerUserErrors = (res, err) => {
  if (err instanceof mongoose.Error.ValidationError
    || err instanceof mongoose.Error.CastError) {
    return res.status(httpStatus.BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные пользователя.' });
  }
  if (err.name === 'notFound') {
    return res.status(httpStatus.NOT_FOUND)
      .send({ message: 'Пользователь по указанному _id не найден' });
  }
  if (err.statusCode === 401) {
    return res.status(httpStatus.UNAUTHORIZED)
      .send({ message: 'Пользователь уже существует' });
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};

module.exports = {
  handlerCardsErrors,
  handlerUserErrors,
};
