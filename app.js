const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const app = express();
const port = 3000;

const publicDirectory = path.join(__dirname, './public');

//express libraries
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs');

//Routes
const indexRouter = require('./routes/index');
const indexAuth = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const itemsRouter = require('./routes/items');

app.use('/', indexRouter);
app.use('/auth', indexAuth);
app.use('/dashboard', dashboardRouter);
app.use('/items', itemsRouter);

app.listen(process.env.PORT || 3000);