const bcrypt = require('bcrypt');
const formatErrors = require('../helpers/formatErrors');

const { tryLogin } = require('../helpers/auth');
const { requiresAuth } = require('../helpers/permissions');

module.exports = {
  Query: {
    getUser: requiresAuth.createResolver(async (parent, { id }, { models, user }) => {
      try {
        const foundUser = await models.User.findById(id || user.id);
        if (!foundUser) {
          throw new Error("User didn't found");
        }
        return foundUser;
      } catch (err) {
        return err;
      }
    }),
    getAllUsers: async (parent, args, { models }) => await models.User.find(),
  },
  Mutation: {
    register: async (parent, args, { models, SECRET, SECRET2 }) => {
      try {
        await new models.User(args).save();
        return await tryLogin(args.email, args.password, models, SECRET, SECRET2);
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },

    login: async (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      await tryLogin(email, password, models, SECRET, SECRET2),

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
      async (parent, { oldPassword, newPassword }, { models, user }) => {
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
          return {
            ok: true,
            user: foundUser,
          };
        } catch (err) {
          return {
            ok: false,
            errors: formatErrors(err),
          };
        }
      }
    ),
  },
  User: {
    channels: async ({ id }, args, { models }) => await models.Channel.find({ owner: id }),
    messages: async ({ id }, args, { models }) => await models.Message.find({ userId: id }),
  },
};
