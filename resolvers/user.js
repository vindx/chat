const { tryLogin } = require('../helpers/auth');
const formatErrors = require('../helpers/formatErrors');

module.exports = {
  Query: {
    getUser: async (parent, { id }, { models }) => {
      try {
        const user = await models.User.findById(id);
        if (!user) {
          throw new Error("User didn't found");
        }
        return user;
      } catch (err) {
        return err;
      }
    },
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
};
