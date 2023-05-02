const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', router);
app.use((err, req, res, next) => {
  const { statusCode = httpStatus.INTERNAL_SERVER_ERROR, message } = err;
  if (err instanceof mongoose.Error.CastError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'Некоректный _id' });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(httpStatus.BAD_REQUEST).send({ message });
  }
  return res
    .status(statusCode)
    .send({
      message: statusCode === httpStatus.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
});
