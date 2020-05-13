const { PubSub, withFilter } = require('apollo-server-express');

const { requiresChannelAccess } = require('../helpers/permissions');

const pubSub = new PubSub();
const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';
const DELETE_CHANNEL_MESSAGE = 'DELETE_CHANNEL_MESSAGE';
const EDIT_CHANNEL_MESSAGE = 'EDIT_CHANNEL_MESSAGE';

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
    deleteMessage: {
      subscribe: requiresChannelAccess.createResolver(
        withFilter(
          () => pubSub.asyncIterator(DELETE_CHANNEL_MESSAGE),
          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
    editMessage: {
      subscribe: requiresChannelAccess.createResolver(
        withFilter(
          () => pubSub.asyncIterator(EDIT_CHANNEL_MESSAGE),
          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
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
    editMessage: requiresChannelAccess.createResolver(
      async (parent, { messageId, text, channelId }, { models }) => {
        try {
          const updatedMessage = await models.Message.findByIdAndUpdate(
            messageId,
            { text },
            { new: true }
          );

          await pubSub.publish(EDIT_CHANNEL_MESSAGE, {
            channelId,
            editMessage: updatedMessage,
          });

          return updatedMessage;
        } catch (err) {
          console.log(err);
          return err;
        }
      }
    ),
    deleteMessage: requiresChannelAccess.createResolver(
      async (parent, { channel, messageId, channelId }, { models, user }) => {
        try {
          const message = await models.Message.findById(messageId);
          if (String(message.userId) === user.id) {
            const deletedMessage = await models.Message.findByIdAndDelete(messageId);
            const index = channel.messages.indexOf(deletedMessage.id);
            if (index !== -1) {
              channel.messages.splice(index, 1);
              await channel.save();
            }

            await pubSub.publish(DELETE_CHANNEL_MESSAGE, {
              channelId,
              deleteMessage: deletedMessage,
            });

            return { ok: true, message: deletedMessage };
          }
          return {
            ok: false,
            errors: [
              {
                type: 'not an owner',
                path: 'delete message',
                message: 'You are not an owner of this message',
              },
            ],
          };
        } catch (err) {
          console.log(err);
          return err;
        }
      }
    ),
  },
  Message: {
    user: async ({ userId }, args, { models }) => await models.User.findById(userId),
    channel: async ({ channelId }, args, { models }) => await models.Channel.findById(channelId),
  },
};
