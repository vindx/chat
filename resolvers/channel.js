const formatErrors = require('../helpers/formatErrors');
const { requiresAuth, requiresChannel } = require('../helpers/permissions');

module.exports = {
  Query: {
    getChannel: requiresChannel.createResolver(async (parent, { channel }) => {
      try {
        return channel;
      } catch (err) {
        return err;
      }
    }),
    getAllChannels: requiresAuth.createResolver(
      async (parent, args, { models, user }) => await models.Channel.find({ members: user.id })
    ),
  },
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const channel = new models.Channel({ ...args, owner: user.id, members: [user.id] });
        await channel.save();
        return { ok: true, channel };
      } catch (err) {
        return { ok: false, errors: formatErrors(err) };
      }
    }),
    joinChannel: requiresAuth.createResolver(async (parent, { secretKey }, { models, user }) => {
      const channelKey = await models.ChannelKey.find({ shortId: secretKey });
      if (!channelKey.length) {
        return {
          ok: false,
          errors: [{ type: 'expired', path: 'join channel', message: 'Secret key is expired' }],
        };
      }
      const { channelId } = channelKey[0];
      const channel = await models.Channel.findById(channelId);
      if (!channel) {
        return {
          ok: false,
          errors: [
            { type: 'channel not found', path: 'join channel', message: "Channel didn't found" },
          ],
        };
      }
      if (channel.members.includes(user.id)) {
        return {
          ok: false,
          errors: [
            {
              type: 'already in',
              path: 'join channel',
              message: 'You are already in this channel',
            },
          ],
        };
      }
      channel.members.push(user.id);
      await channel.save();
      return {
        ok: true,
        channel,
      };
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
