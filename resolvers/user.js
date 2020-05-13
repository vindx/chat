const formatErrors = require('../helpers/formatErrors');

const { tryLogin } = require('../helpers/auth');
const { requiresAuth } = require('../helpers/permissions');

module.exports = {
  Query: {
    getUser: requiresAuth.createResolver(async (parent, { id }, { models, user }) => {
      try {
        const foundUser = await models.User.findById(id || user.id);
        console.log(foundUser);
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
  },
  User: {
    channels: async ({ id }, args, { models }) => await models.Channel.find({ owner: id }),
    messages: async ({ id }, args, { models }) => await models.Message.find({ userId: id }),
  },
};
