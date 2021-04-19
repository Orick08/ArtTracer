const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

exports.newItem = (req, res)=>{
  let data = req.body;

  data.id_categoria = parseInt(data.categoria);
  delete data.categoria;

  //Add db user id to the data
  if(req.cookies.artToken){
    const DECODED_COOKIE = res.locals.DECODED_COOKIE;
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

  data.inicio = new Date(data.inicio).toISOString().slice(0, 10).replace('T', ' ');
  try{
    data.final = new Date(data.final).toISOString().slice(0, 10).replace('T', ' ');
  }
  catch{
    data.final = null;
  }
  

  db.query('INSERT INTO items SET ?', data, (error, results) =>{
    if(error){
      console.log(error);
      //TODO: Proper error message
      res.redirect('/dashboard');
      return;
    }

    res.redirect('/dashboard');
  });
}

exports.listItems = (req, res) =>{
  const DECODED_COOKIE = res.locals.DECODED_COOKIE;

  //Check if user id exists
  if(DECODED_COOKIE.id == undefined){
    res.render('index', {message: "You need to login to see this page!"});
    return;
  }

  //Read list of items database
  db.query('SELECT * FROM items WHERE ?', {id_usuario: DECODED_COOKIE.id}, (error, results) =>{
    if(error){
      console.log(error);
      //TODO: Proper error message
      res.redirect('/dashboard');
      return;
    }
    res.json(results);
  });
}