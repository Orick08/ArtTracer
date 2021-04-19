const express = require('express');
const middleCookie = require('../controllers/middleCookie');
const itemsController = require('../controllers/items');
const Router = express.Router();

//Instance in localhost:3000/items/...
Router.post('/new-item', middleCookie.needsCookie, itemsController.newItem);
Router.get('/list-items', middleCookie.needsCookie, itemsController.listItems);

module.exports = Router;