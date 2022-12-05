const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const cookieJWT = req.cookies[process.env.COOKIE_NAME];
    if (!cookieJWT) throw new Error('You must be signed in to continue');

    const user = jwt.verify(cookieJWT, process.env.JWT_SECRET);
    req.user = user;
    
    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};
