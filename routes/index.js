const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../utils/errors/not-found-error');

router.use('/users', userRouter);
router.use('/cards', cardsRouter);
router.use('*', () => {
  throw new NotFoundError('Неправильно задан Url');
});

module.exports = router;
