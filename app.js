const express = require('express');
const mongoose = require('mongoose');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1/mestodb');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', router);

app.listen(PORT, () => {
});
