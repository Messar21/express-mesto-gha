const httpStatus = require('http-status');
const Card = require('../models/card');
const { handlerCardsErrors } = require('../utils/handlerErrors');
const { errorNotFound } = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(httpStatus.CREATED).send(newCard);
    })
    .catch((err) => handlerCardsErrors(res, err));
};

const getCard = (req, res) => {
  const { cardId } = req.params;
  Card.findOne({ _id: cardId })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        return Promise.reject(errorNotFound);
      }
      return res.status(httpStatus.OK).send(card);
    })
    .catch((err) => handlerCardsErrors(res, err));
};

const getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(httpStatus.OK).send(cards);
    })
    .catch((err) => handlerCardsErrors(res, err));
};

const deleteCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;
  Card.findOneAndDelete({ _id: cardId, owner: _id })
    .then((card) => {
      if (!card) {
        return Promise.reject(errorNotFound);
      }
      return res.status(httpStatus.OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => handlerCardsErrors(res, err));
};

const putLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return Promise.reject(errorNotFound);
      }
      return res.status(httpStatus.OK).send(card);
    })
    .catch((err) => handlerCardsErrors(res, err));
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        return Promise.reject(errorNotFound);
      }
      return res.status(httpStatus.OK).send(card);
    })
    .catch((err) => handlerCardsErrors(res, err));
};

module.exports = {
  createCard,
  getCard,
  getAllCards,
  deleteCard,
  putLike,
  deleteLike,
};
