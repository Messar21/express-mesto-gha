const cardsRouter = require('express').Router();
const { createCard, getCard } = require('../controllers/cards');

cardsRouter.post('/', createCard);
cardsRouter.get('/:id', getCard);

module.exports = cardsRouter;
