const httpStatus = require('http-status');
const Card = require('../models/card');
const NotFoundError = require('../utils/errors/not-found-error');
const ForbiddenError = require('../utils/errors/forbidden-error');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(httpStatus.CREATED).send(newCard);
    })
    .catch(next);
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(httpStatus.OK).send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findOne({ _id: cardId })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена');
      }
    })
    .then(() => {
      Card.findOneAndDelete({ _id: cardId, owner: userId })
        .then((card) => {
          if (!card) {
            throw new ForbiddenError('Доступ запрещен!');
          }
          res.status(httpStatus.OK).send({ message: 'Карточка удалена' });
        })
        .catch(next);
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена');
      }
      return res.status(httpStatus.OK).send(card);
    })
    .catch(next);
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена');
      }
      return res.status(httpStatus.OK).send(card);
    })
    .catch(next);
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  putLike,
  deleteLike,
};
