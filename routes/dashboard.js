const express = require('express');
const auth = require('../controllers/auth');
const Router = express.Router();

//Instance in localhost:3000/dashboard/...
Router.get('/', auth.needsCookie,(req, res) =>{
  res.render('dashboard');
});

module.exports = Router;