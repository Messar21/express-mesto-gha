const userRouter = require('express').Router();
const {
  createUser,
  getUser,
  getAllUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/:userId', getUser);
userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
