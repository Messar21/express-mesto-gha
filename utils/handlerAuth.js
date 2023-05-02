const BadRequest = require('./errors/bad-req-error');

const handlerAuth = (req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest('Email или пароль не могут быть пустыми');
  }
};

module.exports = { handlerAuth };
