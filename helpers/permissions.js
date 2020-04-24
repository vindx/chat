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

const requiresChannelAccess = requiresAuth.createResolver(
  async (parent, { channelId }, { models, user }) => {
    const channel = await models.Channel.findById(channelId);
    const member = channel.members.includes(user.id);
    if (!member) {
      throw new Error('You have to be a member of this channel');
    }
  }
);

module.exports = { requiresAuth, requiresChannelAccess };
