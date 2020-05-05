const { PubSub, withFilter } = require('apollo-server-express');

const { requiresChannelAccess } = require('../helpers/permissions');

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
    getMessages: requiresChannelAccess.createResolver(
      async (parent, { offset, limit = 10, channelId }, { models }) =>
        await models.Message.find({ channelId }).sort({ _id: -1 }).limit(limit).skip(offset)
    ),
  },
  Mutation: {
    createMessage: requiresChannelAccess.createResolver(
      async (parent, { channel, file, ...args }, { models, user }) => {
        try {
          // const { createReadStream, filename, mimetype } = await file;
          // console.log(createReadStream, filename, mimetype);
          // await new Promise((res) =>
          //   createReadStream(path.join(__dirname, '../files', filename))
          //     .pipe(createWriteStream(path.join(__dirname, '../files', filename)))
          //     .on('close', res)
          // );
          // console.log(args);
          // const messageData = args;
          // // if (file) {
          // //   messageData.fileType = file.type;
          // //   messageData.url = file.path;
          // // }

          const newMessage = new models.Message({ ...args, userId: user.id });
          await newMessage.save();

          channel.messages.push(newMessage.id);
          await channel.save();

          await pubSub.publish(NEW_CHANNEL_MESSAGE, {
            channelId: args.channelId,
            newChannelMessage: newMessage,
          });

          return newMessage;
        } catch (err) {
          console.log(err);
          return err;
        }
      }
    ),
  },
};
