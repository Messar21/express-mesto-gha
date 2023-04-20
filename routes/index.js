const httpStatus = require('http-status');
const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({ message: 'Неправильно задан путь' });
});

module.exports = router;
