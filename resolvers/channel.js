const formatErrors = require('../formatErrors');

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
    createChannel: async (parent, args, { models }) => {
      try {
        const newChannel = new models.Channel(args);
        await newChannel.save();
        return { ok: true };
      } catch (err) {
        return { ok: false, errors: formatErrors(err) };
      }
    },
  },
};
