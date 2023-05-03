const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../utils/errors/conflict-error');
const Unauthorised = require('../utils/errors/unauth-error');
const NotFoundError = require('../utils/errors/not-found-error');
const { handlerAuth } = require('../utils/handlerAuth');
const { generateJWT } = require('../utils/generateJWT');

const createUser = (req, res, next) => {
  handlerAuth(req);
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь уже существует');
      }
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((newUser) => {
      User.findOne({ _id: newUser._id })
        .then((createdUser) => {
          res.status(httpStatus.CREATED).send(createdUser);
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  handlerAuth(req);
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorised('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorised('Неправильные почта или пароль');
          }
          const token = generateJWT(user._id);
          return res.status(httpStatus.OK).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  let { userId } = req.params;
  if (userId === 'me') {
    userId = req.user._id;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(httpStatus.OK).send(user);
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(httpStatus.OK).send(users);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findOneAndUpdate({ _id }, { $set: { name, about } }, { new: true, runValidators: true })
    .then((user) => {
      res.status(httpStatus.OK).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findOneAndUpdate({ _id }, { $set: { avatar } }, { new: true, runValidators: true })
    .then((user) => {
      res.status(httpStatus.OK).send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateProfile,
  updateAvatar,
  login,
};
