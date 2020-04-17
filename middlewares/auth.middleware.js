const jwt = require('jsonwebtoken');
const { refreshTokens } = require('../helpers/auth');

module.exports = (models, SECRET, SECRET2) => async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['auth-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['auth-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set({
          'Access-Control-Expose-Headers': 'auth-token, auth-refresh-token',
          'auth-token': newTokens.token,
          'auth-refresh-token': newTokens.refreshToken,
        });
        req.user = newTokens.user;
      }
    }
  }
  return next();
};
