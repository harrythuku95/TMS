const { ValidationError } = require('../services/notifications/errors/validation');
const helpers = require('../helpers');

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (roles.includes(req.currentUser.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};

const setCurrentUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = helpers.jwtVerify(token);
      console.log('Decoded token:', decoded);
      req.currentUser = decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  next();
};

module.exports = { checkRole, setCurrentUser };