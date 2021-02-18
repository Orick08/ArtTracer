const express = require('express');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

//Routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.listen(port);