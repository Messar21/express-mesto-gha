const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handlerUserErrors } = require('../utils/handlerErrors');
const { errorNotFound } = require('../utils/errors');
const { handlerAuth } = require('../utils/handlerAuth');
const { generateJWT } = require('../utils/generateJWT');

const createUser = (req, res) => {
  handlerAuth(req, res);
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error();
        error.statusCode = 401;
        return Promise.reject(error);
      }
      return null;
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      res.status(httpStatus.CREATED).send({ message: `Пользователь ${newUser.email} успешно зарегистрирован` });
    })
    .catch((err) => handlerUserErrors(res, err));
};

const login = (req, res) => {
  handlerAuth(req, res);
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = generateJWT(user._id);
          return res.status(201).send({ token });
        });
    })
    .catch((err) => handlerUserErrors(res, err));
};

const getUser = (req, res) => {
  let { userId } = req.params;
  if (userId === 'me') {
    userId = req.user._id;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return Promise.reject(errorNotFound);
      }
      return res.status(httpStatus.OK).send(user);
    })
    .catch((err) => handlerUserErrors(res, err));
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(httpStatus.OK).send(users);
    })
    .catch((err) => handlerUserErrors(res, err));
};

const updateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id }, { $set: { name, about } }, { new: true, runValidators: true })
    .then((user) => {
      res.status(httpStatus.OK).send(user);
    })
    .catch((err) => handlerUserErrors(res, err));
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id }, { $set: { avatar } }, { new: true, runValidators: true })
    .then((user) => {
      res.status(httpStatus.OK).send(user);
    })
    .catch((err) => handlerUserErrors(res, err));
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateProfile,
  updateAvatar,
  login,
};
