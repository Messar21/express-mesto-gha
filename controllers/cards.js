const mongoose = require('mongoose');
const httpStatus = require('http-status');
const Card = require('../models/card');

const handlerCardsErrors = (req, res, err) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(httpStatus.BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные.' });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(httpStatus.NOT_FOUND)
      .send({ message: 'Карточка по указанному _id не найденa.' });
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR)
    .send({ message: 'На сервере произошла ошибка' });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(httpStatus.CREATED).send(newCard);
    })
    .catch((err) => handlerCardsErrors(req, res, err));
};

const getCard = (req, res) => {
  const { cardId } = req.params;
  Card.findOne(cardId)
    .populate('owner')
    .populate('likes')
    .then((card) => {
      res.status(httpStatus.OK).send(card);
    })
    .catch((err) => handlerCardsErrors(req, res, err));
};

const getAllCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => {
      res.status(httpStatus.OK).send(cards);
    })
    .catch((err) => handlerCardsErrors(req, res, err));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then(() => {
      res.status(httpStatus.OK).send('Карточка удалена');
    })
    .catch((err) => handlerCardsErrors(req, res, err));
};

const putLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      res.status(httpStatus.OK).send(card);
    })
    .catch((err) => handlerCardsErrors(req, res, err));
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      res.status(httpStatus.OK).send(card);
    })
    .catch((err) => handlerCardsErrors(req, res, err));
};

module.exports = {
  createCard,
  getCard,
  getAllCards,
  deleteCard,
  putLike,
  deleteLike,
};
