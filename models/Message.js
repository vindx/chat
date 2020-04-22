const { Schema, model, Types } = require('mongoose');

const messageSchema = new Schema({
  text: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'User' },
  channelId: { type: Types.ObjectId, ref: 'Channel' },
  createdAt: { type: Date, required: true, default: Date.now },
});

module.exports = model('Message', messageSchema);
