const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
};

const getCard = (req, res) => {
  const { id } = req.params;
  Card.findById(id)
    .populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(400).send('Карточка не найдена');
    });
};

module.exports = {
  createCard,
  getCard,
};
