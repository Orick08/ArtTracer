const express = require('express');
const Router = express.Router();

Router.get('/', (req,res)=>{
  res.render("index");
})

Router.post('/register', (req, res)=>{
  res.send("Exception not implemented yet");
})

module.exports = Router;