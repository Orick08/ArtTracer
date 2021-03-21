const express = require('express');
const middleCookie = require('../controllers/middleCookie');
const Router = express.Router();

//Instance in localhost:3000/items/...
Router.post('/new-item', middleCookie.needsCookie,(req, res) =>{
  console.log(req.body);
  res.json(req.body);
});

module.exports = Router;