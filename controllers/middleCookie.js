const jwt = require('jsonwebtoken');

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
      res.locals.DECODED_COOKIE = DECODED_COOKIE;
      next();
      return;
    }
  }

  res.render('index', {message: "You need to login to see this page!"})
}