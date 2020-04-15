module.exports = {
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
    getAllMessages: async (parent, args, { models }) => await models.Message.find()
  },
  Mutation: {
    createMessage: async (parent, args, { models }) => {
      try {
        const newMessage = new models.Message(args);
        await newMessage.save();
        return newMessage;
      } catch (err) {
        return err;
      }
    }
  }
};
