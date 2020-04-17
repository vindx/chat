const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createTokens = async (user, secret, secret2) => {
  const { id } = user;
  const createToken = jwt.sign({ user: { id } }, secret, { expiresIn: '1h' });
  const createRefreshToken = jwt.sign({ user: { id } }, secret2, { expiresIn: '7d' });

  return [createToken, createRefreshToken];
};

const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ email });
  if (!user) {
    // user with that email not found
    return {
      ok: false,
      errors: [{ type: 'not found', path: 'email', message: 'No user with this email exists' }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    // wrong password
    return {
      ok: false,
      errors: [{ type: 'wrong password', path: 'password', message: 'Wrong password' }],
    };
  }

  const refreshSecret = user.password + SECRET2;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshSecret);

  return {
    ok: true,
    token,
    refreshToken,
  };
};

module.exports = { tryLogin };
