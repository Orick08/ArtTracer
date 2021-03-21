const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

exports.newItem = (req, res)=>{
  let data = req.body;

  data.categoria = parseInt(data.categoria);
  res.json(req.body);
}