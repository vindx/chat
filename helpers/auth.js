const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createTokens = async (user, secret, secret2) => {
  const { id } = user;
  const createToken = jwt.sign({ user: { id } }, secret, { expiresIn: '1h' });
  const createRefreshToken = jwt.sign({ user: { id } }, secret2, { expiresIn: '7d' });

  return [createToken, createRefreshToken];
};

const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId;
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken);
    userId = id;
  } catch (e) {
    return {};
  }

  if (!userId) {
    return { error: 'Something wrong with refresh token!' };
  }

  const user = await models.User.findById(userId);

  if (!user) {
    return { error: 'Wrong token!' };
  }

  const { id, password } = user;
  const refreshSecret = password + SECRET2;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (e) {
    return { error: "Token and secret don't match" };
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: { id },
  };
};

const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = (await models.User.findOne({ email }))
    || (await models.User.findOne({ userName: email }));
  if (!user) {
    // user with that email not found
    return {
      ok: false,
      errors: [{ type: 'not found', path: 'email', message: 'No user with this email exists' }],
    };
  }

  if (!user.confirmed) {
    return {
      ok: false,
      errors: [
        { type: 'not confirmed', path: 'confirmation', message: 'Please confirm your email to login' },
      ],
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

module.exports = { tryLogin, refreshTokens };
