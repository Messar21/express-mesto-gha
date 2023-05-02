const handlerAuth = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  }
};

module.exports = { handlerAuth };
