const requiresAuth = require('../helpers/permissions');

module.exports = {
  Query: {
    getMessage: async (parent, { id }, { models }) => {
      try {
        const message = await models.Message.findById(id);
        if (!message) {
          throw new Error("Message didn't found");
        }
        return message;
      } catch (err) {
        return err;
      }
    },
    getAllMessages: async (parent, args, { models }) => await models.Message.find(),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const newMessage = new models.Message({ ...args, userId: user.id });
        await newMessage.save();
        return newMessage;
      } catch (err) {
        return err;
      }
    }),
  },
};
