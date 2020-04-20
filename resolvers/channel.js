const formatErrors = require('../helpers/formatErrors');
const requiresAuth = require('../helpers/permissions');

module.exports = {
  Query: {
    getChannel: async (parent, { id }, { models }) => {
      try {
        const channel = await models.Channel.findById(id);
        if (!channel) {
          throw new Error("Channel didn't found");
        }
        return channel;
      } catch (err) {
        return err;
      }
    },
    getAllChannels: async (parent, args, { models }) => await models.Channel.find(),
  },
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const newChannel = new models.Channel({ ...args, owner: user.id });
        await newChannel.save();
        return { ok: true };
      } catch (err) {
        return { ok: false, errors: formatErrors(err) };
      }
    }),
  },
};
