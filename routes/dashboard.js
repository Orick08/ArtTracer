const express = require('express');
const Router = express.Router();

//Instance in localhost:3000/dashboard/...
Router.get('/', (req, res) =>{
  res.render('dashboard');
});

module.exports = Router;