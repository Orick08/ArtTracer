const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

exports.register = (req, res) => {
  console.log(req.body);

  const { user, email, password} = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], (error, result)=>{
    if(error){
      console.log(error);
      //TODO: Mostrar el error en el front-end
      return;
    }

    if(result.length > 0){
      //TODO: Mostrar mensaje de error en el front-end usuario ya registrado
      return;
    }

    
  })

  res.send("Form submited");
}