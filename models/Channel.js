const { Schema, model, Types } = require('mongoose');

const channelSchema = new Schema({
  name: { type: String, required: [true, 'Name is required'] },
  owner: { type: Types.ObjectId, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
});

module.exports = model('Channel', channelSchema);
