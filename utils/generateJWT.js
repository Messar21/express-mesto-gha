const jwt = require('jsonwebtoken');

const SECRET = 'mosthiddensecretofallsecrets';

const generateJWT = (id) => jwt.sign({ _id: id }, SECRET, { expiresIn: '7d' });

module.exports = { generateJWT };
