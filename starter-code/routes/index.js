const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const user_name = req.body.username;

  if (req.body.username === '' || req.body.password === '') {
    res.render('signup', {
      message: 'User name and Password cannot be empty!',
    });
    return;
  }
  User.findOne({ user_name: `${user_name}` }).then((user) => {
    if (user !== null) {
      res.render('signup', {
        message: 'The username already exists!',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      user_name,
      password: hashPass,
    });
    newUser
      .save()
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

router.get('/signin', (req, res, next) => {
  res.render('signIn');
});

router.post('/signin', (req, res, next) => {
  const user_name = req.body.username;

  if (req.body.username === '' || req.body.password === '') {
    res.render('signIn', {
      message: 'User name and Password cannot be empty!',
    });
    return;
  }
  User.findOne({ user_name: `${user_name}` }).then((user) => {
    if (user === null) {
      res.render('signIn', {
        message: 'The username doens\'t exists, signUp first!',
      });
      return;
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.currentUser = user;
      console.log(user);
      res.redirect('/');
    } else {
      res.render('signIn', {
        message: 'Incorrect Password!',
      });
    }
  });
});

module.exports = router;
