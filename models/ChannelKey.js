const { Schema, model, Types } = require('mongoose');

const channelKeySchema = new Schema({
  channelId: { type: Types.ObjectId, required: true, ref: 'Channel' },
  shortId: { type: String, required: [true, 'Short ID is missing'], unique: true },
  expireAt: { type: Date, default: undefined },
});

channelKeySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('ChannelKey', channelKeySchema);
