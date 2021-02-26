const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const app = express();
const port = 3000;

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'ejs');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

db.connect((error)=>{
  if(error){
    console.log(error);
    return
  }

  console.log("Mysql connected...");
})

//Routes
const indexRouter = require('./routes/index');
const indexAuth = require('./routes/auth');
app.use('/', indexRouter);
app.use('/auth', indexAuth);

app.listen(port);