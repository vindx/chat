const shortid = require('shortid');
const requiresAuth = require('../helpers/permissions');

module.exports = {
  Mutation: {
    createChannelKey: requiresAuth.createResolver(
      async (parent, { channelId }, { models, user }) => {
        const channel = await models.Channel.findById(channelId);

        if (String(channel.owner) !== user.id) {
          return {
            ok: false,
            errors: [
              {
                type: 'not owner',
                path: 'createChannelKey',
                message: 'You are not the owner of this channel',
              },
            ],
          };
        }

        const createShortId = async () => {
          let shortId = shortid.generate();
          const alreadyExist = await models.ChannelKey.find({ shortId });
          if (alreadyExist) {
            shortId = shortid.generate();
          }
          return shortId;
        };

        const minutesFromNow = (minutes = 5) => {
          const now = new Date();
          return now.setSeconds(now.getSeconds() + 60 * minutes);
        };

        const existedChannelKey = await models.ChannelKey.find({ channelId });
        if (existedChannelKey.length) {
          const channelKey = existedChannelKey[0];
          channelKey.shortId = await createShortId();
          channelKey.expireAt = minutesFromNow(5);
          await channelKey.save();

          return {
            ok: true,
            channelKey,
          };
        }

        const shortId = await createShortId();
        const expireAtTenMinutes = minutesFromNow(10);
        const channelKey = new models.ChannelKey({
          channelId,
          shortId,
          expireAt: expireAtTenMinutes,
        });
        await channelKey.save();

        return {
          ok: true,
          channelKey,
        };
      }
    ),
  },
};
