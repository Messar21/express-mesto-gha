const jwt = require('jsonwebtoken');
const Unauthorised = require('../utils/errors/unauth-error');

const SECRET = 'mosthiddensecretofallsecrets';

const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Unauthorised('Необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = await jwt.verify(token, SECRET);
    } catch (err) {
      next(new Unauthorised('Необходима авторизация'));
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { auth };
