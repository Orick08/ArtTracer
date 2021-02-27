const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

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
      //TODO: Mensaje de error si no se subio bien el formulario
      return res.status(400);
    }

    db.query('SELECT * FROM usuarios WHERE nick = ?', [user], async (error, results)=>{
      if(error){
        //TODO: Error de base de datos
        console.log(error);
      }

      if(!results || !(await bcrypt.compare(password, results[0].pass))){
        //TODO: Error email or password is incorrect
      }
      else{
        const id = results[0].id;

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
        //TODO: Redirect, successful login
      }
    });


  } catch (error) {
    console.log(error);
  }
}