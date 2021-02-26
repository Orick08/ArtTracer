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
      console.log(error);
      //TODO: Mostrar el error en el front-end
      return;
    }

    if(result.length > 0){
      //TODO: Mostrar mensaje de error en el front-end usuario ya registrado
      return;
    }

    let hashedPass = await bcrypt.hash(password, 10);

    db.query('INSERT INTO usuarios SET ?', {nick: user, email: email, pass: hashedPass}, (error, results) =>{
      if(error){
        console.log(error);
        //TODO: no se pudo registrar el usuario en la base de datos
        return;
      }

      //TODO: Exito, el usuario se registro exitosamente
    });
  })

  res.send("Form submited");
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