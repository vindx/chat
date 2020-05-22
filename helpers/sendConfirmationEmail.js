const jwt = require('jsonwebtoken');

module.exports = async ({ id, email } = {}, { transporter, ADMIN_EMAIL, EMAIL_SECRET } = {}, URL) =>
  await jwt.sign(
    { user: { id } },
    EMAIL_SECRET,
    {
      expiresIn: '20m',
    },
    (err, emailToken) => {
      const url = `${URL}/confirmation/${emailToken}`;
      transporter.sendMail({
        from: `"DICO chat team 👻" <${ADMIN_EMAIL}>`,
        to: email,
        subject: 'Confirming Email',
        html: `Please click <a href="${url}">here</a> to confirm your email`,
      });
    }
  );
