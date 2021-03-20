const express = require('express');
const middleCookie = require('../controllers/middleCookie');
const Router = express.Router();

//Instance in localhost:3000/dashboard/...
Router.get('/', middleCookie.needsCookie,(req, res) =>{
  res.render('dashboard');
});

module.exports = Router;