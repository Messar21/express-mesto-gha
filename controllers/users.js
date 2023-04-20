const httpStatus = require('http-status');
const User = require('../models/user');
const { handlerUserErrors } = require('../utils/handlerErrors');
const { errorNotFound } = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(httpStatus.CREATED).send(newUser);
    })
    .catch((err) => handlerUserErrors(res, err));
};

const getUser = (req, res) => {
  const { userId } = req.params;
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
};
