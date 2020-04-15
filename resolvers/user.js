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
    getAllUsers: async (parent, args, { models }) => await models.User.find()
  },
  Mutation: {
    createUser: async (parent, args, { models }) => {
      try {
        const newUser = new models.User(args);
        await newUser.save();
        return newUser;
      } catch (err) {
        return err;
      }
    }
  }
};
