const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.Secret_key, (err, user) => {
      if (err) {
        return res.status(403).json({message:'unauthorized'});
      }
      req.user = user;
      next();
    });
  } else {
    res.json({message:'unauthorized'});
  }
};

module.exports = authenticate;