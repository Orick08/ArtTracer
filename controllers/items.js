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

  data.id_categoria = parseInt(data.categoria);
  delete data.categoria;

  //Add db user id to the data
  if(req.cookies.artToken){
    const DECODED_COOKIE = jwt.verify(req.cookies.artToken, process.env.JWT_SECRET, 'HS512');
    if(DECODED_COOKIE.id){
      data.id_usuario = DECODED_COOKIE.id;
    }else{
      res.render('index', {message: "You need to login to see this page!"});
      return;
    }
  }else{
    res.render('index', {message: "You need to login to see this page!"});
    return;
  }

  data.inicio = new Date(data.inicio).toISOString().slice(0, 10).replace('T', ' ');;
  data.final = new Date(data.final).toISOString().slice(0, 10).replace('T', ' ');;

  db.query('INSERT INTO items SET ?', data, (error, results) =>{
    if(error){
      console.log(error);
    }

    res.redirect('/dashboard');
  });
}