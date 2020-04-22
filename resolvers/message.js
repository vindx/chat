const requiresAuth = require('../helpers/permissions');

module.exports = {
  Message: {
    user: async ({ userId }, args, { models }) => await models.User.findById(userId),
  },
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
    getMessages: requiresAuth.createResolver(
      async (parent, { channelId }, { models }) => await models.Message.find({ channelId })
    ),
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
