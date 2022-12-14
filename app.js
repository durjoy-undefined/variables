//jshint esversion:6

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('home');
});
app.get('/login', function (req, res) {
  res.render('login');
});
app.get('/register', function (req, res) {
  res.render('register');
});
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

console.log(process.env.API_KEY);

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password'],
});

const User = new mongoose.model('User', userSchema);

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, (err, findUser) => {
    if (err) {
      console.log(err);
    } else {
      if (findUser) {
        if (findUser.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});
app.listen(4000, function () {
  console.log('server is started at port: 4000');
});
