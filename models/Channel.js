const { Schema, model, Types } = require('mongoose');

const channelSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'The name needs to be at least 3 characters long'],
    maxlength: [20, 'The name needs to be not more 20 characters long'],
  },
  owner: { type: Types.ObjectId, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
});

module.exports = model('Channel', channelSchema);
