const express = require('express');
const auth = require('../controllers/auth');
const Router = express.Router();

Router.get('/', auth.redirectWithCookie,(req,res)=>{
  res.render("index");
});

module.exports = Router;