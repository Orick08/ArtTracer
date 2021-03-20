const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

exports.redirectWithCookie = (req, res, next) =>{
  if(req.cookies.artToken){
    const DECODED_COOKIE = jwt.verify(req.cookies.artToken, process.env.JWT_SECRET, 'HS512');
    if(DECODED_COOKIE.id){
      res.redirect('/dashboard')
    }
  }else{
    next();
  }
};

exports.needsCookie = (req, res, next) => {
  if(req.cookies.artToken){
    const DECODED_COOKIE = jwt.verify(req.cookies.artToken, process.env.JWT_SECRET, 'HS512');
    if(DECODED_COOKIE.id){
      next();
      return;
    }
  }

  res.render('index', {message: "You need to login to see this page!"})
}

exports.register = (req, res) => {
  console.log(req.body);

  const { user, email, password} = req.body;

  db.query('SELECT email FROM usuarios WHERE email = ?', [email], async (error, result)=>{
    if(error){
      console.log("Error with the database conection on register controller!!!");
      console.log(error);
      res.render('index', {message: "Unexpected error if this persist please contact the admin."});
      return;
    }

    if(result.length > 0){
      res.render('index', {message: "The email is already on use, if you have an account please login."});
      return;
    }

    let hashedPass = await bcrypt.hash(password, 10);

    db.query('INSERT INTO usuarios SET ?', {nick: user, email: email, pass: hashedPass}, (error, results) =>{
      if(error){
        console.log("Error on the database inserting a new user!!!");
        console.log(error);
        res.render('index', {message: "Unexpected error if this persist please contact the admin."});
        return;
      }

      //TODO: Exito, el usuario se registro exitosamente
    });
  });
}

exports.login = async (req, res) => {
  try {
    const { user, password } = req.body;

    if(!user || !password){
      return res.status(400).render('index', {message: "Please indicate your user and password."});
    }

    db.query('SELECT * FROM usuarios WHERE nick = ?', [user], async (error, results)=>{
      if(error){
        console.log("Database conection error in login");
        console.log(error);
        res.render('index', {message: "Unexpected error if this persist please contact the admin."});
        return;
      }

      if(results.length == 0 || !(await bcrypt.compare(password, results[0].pass))){
        res.render('index', {message: "Your password or email is incorrect"});
        return;
      }
      else{
        const id = results[0].id_usuario;

        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions ={
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('artToken', token, cookieOptions);
        res.status(200);
        res.redirect('/dashboard/')
      }
    });


  } catch (error) {
    console.log(error);
  }
}

exports.logout = (req, res)=>{
  res.clearCookie('artToken');
  res.redirect('/');
}