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
    getAllChannels: requiresAuth.createResolver(
      async (parent, args, { models, user }) => await models.Channel.find({ owner: user.id })
    ),
  },
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const newChannel = new models.Channel({ ...args, owner: user.id, members: [user.id] });
        await newChannel.save();
        return { ok: true };
      } catch (err) {
        return { ok: false, errors: formatErrors(err) };
      }
    }),
  },
  Channel: {
    owner: async ({ owner }, args, { models }) => await models.User.findById(owner),
    messages: async ({ id }, args, { models }) => await models.Message.find({ channelId: id }),
    members: async ({ id }, args, { models }) => {
      const { members: membersIds } = await models.Channel.findById(id);
      return await Promise.all(
        membersIds.map(async (memberId) => await models.User.findById(memberId))
      );
    },
  },
};
