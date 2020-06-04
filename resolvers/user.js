const bcrypt = require('bcrypt');

const formatErrors = require('../helpers/formatErrors');
const { tryLogin } = require('../helpers/auth');
const { requiresAuth } = require('../helpers/permissions');
const sendConfirmationEmail = require('../helpers/sendConfirmationEmail');

module.exports = {
  Query: {
    getUser: requiresAuth.createResolver(
      async (parent, { id, offset, limit }, { models, user }) => {
        try {
          const foundUser = await models.User.findById(id || user.id);
          if (!foundUser) {
            throw new Error("User didn't found");
          }
          foundUser.offset = offset;
          foundUser.limit = limit;
          return foundUser;
        } catch (err) {
          return err;
        }
      }
    ),
    getAllUsers: async (parent, args, { models }) => await models.User.find(),
  },
  Mutation: {
    register: async (parent, args, {
      models, transporter, EMAIL_SECRET, URL, ADMIN_EMAIL
    }) => {
      try {
        const newUser = await new models.User(args).save();

        await sendConfirmationEmail(
          { id: newUser.id, email: args.email },
          { transporter, ADMIN_EMAIL, EMAIL_SECRET },
          URL
        );

        return {
          ok: true,
          successMessage:
            'We send you confirmation email. Please follow the link on that email to confirm your account.',
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },

    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      await tryLogin(email, password, models, SECRET, SECRET2),

    resendConfirmationEmail: async (
      parent,
      { email },
      {
        models, transporter, ADMIN_EMAIL, EMAIL_SECRET, URL
      }
    ) => {
      try {
        const user = await models.User.findOne({ email });
        if (user) {
          await sendConfirmationEmail(
            { id: user.id, email },
            { transporter, ADMIN_EMAIL, EMAIL_SECRET },
            URL
          );
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },

    editUserName: requiresAuth.createResolver(async (parent, { newUserName }, { models, user }) => {
      try {
        if (newUserName.length < 3) {
          return {
            ok: false,
            errors: [
              {
                path: 'edit username',
                type: 'too short username',
                message: 'The username needs to be at least 3 characters long',
              },
            ],
          };
        }
        if (newUserName.length > 25) {
          return {
            ok: false,
            errors: [
              {
                path: 'edit username',
                type: 'too long username',
                message: 'The username needs to be not more 25 characters long',
              },
            ],
          };
        }
        if (!/^[a-zA-Z0-9_-]*$/.test(newUserName)) {
          return {
            ok: false,
            errors: [
              {
                path: 'edit username',
                type: 'wrong validate username',
                message: ' The username can only contain letters, numbers, underscores and dashes',
              },
            ],
          };
        }
        const updatedUser = await models.User.findByIdAndUpdate(
          user.id,
          { userName: newUserName },
          { new: true }
        );
        return {
          ok: true,
          user: updatedUser,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    }),

    editPassword: requiresAuth.createResolver(
      async (parent, { oldPassword, newPassword }, {
        models, user, SECRET, SECRET2
      }) => {
        try {
          const foundUser = await models.User.findById(user.id);
          const valid = await bcrypt.compare(oldPassword, foundUser.password);

          if (!valid) {
            // wrong password
            return {
              ok: false,
              errors: [{ type: 'wrong password', path: 'password', message: 'Wrong password' }],
            };
          }
          foundUser.password = newPassword;
          await foundUser.save();
          return await tryLogin(foundUser.email, newPassword, models, SECRET, SECRET2);
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err),
          };
        }
      }
    ),
    // eslint-disable-next-line consistent-return
    changeTheme: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const foundUser = await models.User.findById(user.id);
        const updatedUser = await models.User.findByIdAndUpdate(
          user.id,
          {
            darkTheme: !foundUser.darkTheme,
          },
          { new: true }
        );
        return updatedUser.darkTheme;
      } catch (e) {
        console.log(e);
      }
    }),
  },
  User: {
    channels: async ({ id, offset = 0, limit = 10 }, args, { models }) =>
      await models.Channel.find({ owner: id }).limit(limit).skip(offset),

    messages: async ({ id, offset = 0, limit = 10 }, args, { models }) =>
      await models.Message.find({ userId: id }).sort({ _id: -1 }).limit(limit).skip(offset),
  },
};
