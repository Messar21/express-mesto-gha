const cardsRouter = require('express').Router();
const {
  createCard,
  getCard,
  getAllCards,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.post('/', createCard);
cardsRouter.get('/:cardId', getCard);
cardsRouter.get('/', getAllCards);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', putLike);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
