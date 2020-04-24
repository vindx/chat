const { PubSub, withFilter } = require('apollo-server-express');

const { requiresAuth, requiresChannelAccess } = require('../helpers/permissions');

const pubSub = new PubSub();
const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

module.exports = {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresChannelAccess.createResolver(
        withFilter(
          () => pubSub.asyncIterator(NEW_CHANNEL_MESSAGE),
          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
  },
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

        await pubSub.publish(NEW_CHANNEL_MESSAGE, {
          channelId: args.channelId,
          newChannelMessage: newMessage,
        });

        return newMessage;
      } catch (err) {
        return err;
      }
    }),
  },
};
