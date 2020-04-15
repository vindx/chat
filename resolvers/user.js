module.exports = {
  Query: {
    getUser: async (parent, { id }, { models }) => await models.User.findById(id),
    getAllUsers: async (parent, args, { models }) => await models.User.find()
  },
  Mutation: {
    createUser: async (parent, args, { models }) => await new models.User(args).save()
  }
};
