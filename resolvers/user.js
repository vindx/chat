const { tryLogin } = require('../auth');

const formatErrors = (e) => {
  if (e.name === 'ValidationError') {
    return Object.keys(e.errors).map((key) => e.errors[key].properties);
  }
  if (e.name === 'MongoError' && e.code === 11000) {
    const path = Object.keys(e.keyPattern)[0];
    return [{ type: 'duplicate key', path, message: 'This user already exists' }];
  }
  return e;
};

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
    register: async (parent, args, { models }) => {
      try {
        const user = await new models.User(args).save();
        return {
          ok: true,
          user,
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
  },
};
