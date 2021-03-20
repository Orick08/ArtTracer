const express = require('express');
const middleCookie = require('../controllers/middleCookie');
const Router = express.Router();

Router.get('/', middleCookie.redirectWithCookie,(req,res)=>{
  res.render("index");
});

module.exports = Router;