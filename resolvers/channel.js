const { PubSub, withFilter } = require('apollo-server-express');

const formatErrors = require('../helpers/formatErrors');
const { requiresAuth, requiresChannelAccess } = require('../helpers/permissions');

const pubSub = new PubSub();
const SMB_JOINED_CHANNEL = 'USER_JOINED_CHANNEL';
const SMB_LEFT_CHANNEL = 'USER_LEFT_CHANNEL';

module.exports = {
  Subscription: {
    smbJoinedChannel: {
      subscribe: requiresChannelAccess.createResolver(
        withFilter(
          () => pubSub.asyncIterator(SMB_JOINED_CHANNEL),
          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
    smbLeftChannel: {
      subscribe: requiresChannelAccess.createResolver(
        withFilter(
          () => pubSub.asyncIterator(SMB_LEFT_CHANNEL),
          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
  },
  Query: {
    getChannel: requiresChannelAccess.createResolver(async (parent, { channel }) => {
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
      const channel2 = await models.Channel.findById(channelId);

      await pubSub.publish(SMB_JOINED_CHANNEL, {
        channelId: String(channelId),
        smbJoinedChannel: channel2,
      });

      return {
        ok: true,
        channel,
      };
    }),
    editChannelName: requiresChannelAccess.createResolver(
      async (parent, { channel, channelName }) => {
        try {
          // eslint-disable-next-line no-param-reassign
          channel.name = channelName;
          await channel.save();
          return { ok: true, channel };
        } catch (err) {
          return { ok: false, errors: formatErrors(err) };
        }
      }
    ),
    leaveChannel: requiresChannelAccess.createResolver(
      async (parent, { channel, channelId }, { models, user }) => {
        if (String(channel.owner) === user.id) {
          return {
            ok: false,
            errors: [
              {
                type: 'cannot leave',
                path: 'leave channel',
                message: 'You are the owner of this channel. Use deleting instead',
              },
            ],
          };
        }
        const updatedChannel = await models.Channel.findByIdAndUpdate(
          channelId,
          {
            $pull: { members: user.id },
          },
          { new: true }
        );

        await pubSub.publish(SMB_LEFT_CHANNEL, {
          channelId,
          smbLeftChannel: updatedChannel,
        });

        return { ok: true, channel: updatedChannel };
      }
    ),
    deleteChannel: requiresChannelAccess.createResolver(
      async (parent, { channel, channelId }, { models, user }) => {
        if (String(channel.owner) !== user.id) {
          return {
            ok: false,
            errors: [
              {
                type: 'cannot delete',
                path: 'delete channel',
                message: "You aren't the owner of this channel and can't delete it",
              },
            ],
          };
        }
        try {
          await Promise.all(
            channel.messages.map(
              async (messageId) => await models.Message.findByIdAndDelete(messageId)
            )
          );
          const deletedChannel = await models.Channel.findByIdAndDelete(channelId);
          return {
            ok: true,
            channel: deletedChannel,
          };
        } catch (err) {
          return { ok: false, errors: formatErrors(err) };
        }
      }
    ),
  },
  Channel: {
    owner: async ({ owner }, args, { models }) => await models.User.findById(owner),
    messages: async ({ id }, args, { models }) => await models.Message.find({ channelId: id }),
    members: async ({ members }, args, { models }) =>
      await Promise.all(members.map(async (memberId) => await models.User.findById(memberId))),
  },
};
