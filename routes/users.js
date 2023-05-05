const { celebrate, Joi } = require('celebrate');

const userRouter = require('express').Router();
const {
  getUser,
  getAllUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().allow('me').hex().length(24),
  }),
}), getUser);
userRouter.get('/', getAllUsers);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .pattern(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:~+#-]*[\w@?^=%&~+#-])/),
  }),
}), updateAvatar);

module.exports = userRouter;
