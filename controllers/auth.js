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