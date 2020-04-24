const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

const requiresAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error('Not authenticated');
  }
});

const requiresChannel = requiresAuth.createResolver(async (parent, args, { models }) => {
  const channel = await models.Channel.findById(args.channelId);
  if (!channel) {
    throw new Error("Channel didn't found");
  } else {
    // eslint-disable-next-line no-param-reassign
    args.channel = channel;
  }
});

const requiresChannelAccess = requiresChannel.createResolver(
  async (parent, { channel }, { user }) => {
    const member = channel.members.includes(user.id);
    if (!member) {
      throw new Error('You have to be a member of this channel');
    }
  }
);

module.exports = { requiresAuth, requiresChannelAccess, requiresChannel };
