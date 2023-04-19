const mongoose = require('mongoose');
const httpStatus = require('http-status');
const User = require('../models/user');

const SUCCES_CODE = 200;
const SUCCES_CREATE_CODE = 201;

const handlerCardErrors = (req, res, err) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(httpStatus.BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные.' });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(httpStatus.NOT_FOUND)
      .send({ message: 'Пользователь по указанному _id не найден' });
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(SUCCES_CREATE_CODE).send(newUser);
    })
    .catch((err) => handlerCardErrors(req, res, err));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.status(SUCCES_CODE).send(user);
    })
    .catch((err) => handlerCardErrors(req, res, err));
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(SUCCES_CODE).send(users);
    })
    .catch((err) => handlerCardErrors(req, res, err));
};

const updateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id }, { $set: { name, about } }, { new: true, runValidators: true })
    .then((user) => {
      res.status(SUCCES_CREATE_CODE).send(user);
    })
    .catch((err) => handlerCardErrors(req, res, err));
};

const updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id }, { $set: { avatar } }, { new: true, runValidators: true })
    .then((user) => {
      res.status(SUCCES_CREATE_CODE).send(user);
    })
    .catch((err) => handlerCardErrors(req, res, err));
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateProfile,
  updateAvatar,
};
