const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const router = require('./routes');
const { handlerErrors } = require('./middlewares/handlerErrors');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .pattern(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:~+#-]*[\w@?^=%&~+#-])/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth);
app.use('/', router);
app.use(errors());
app.use(handlerErrors);

app.listen(PORT, () => {
});
