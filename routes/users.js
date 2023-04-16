const userRouter = require('express').Router();
const { createUser, getUser } = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/:id', getUser);

module.exports = userRouter;
