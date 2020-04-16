const { Schema, model, Types } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: {
      validator: /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      message: 'Invalid email',
    },
  },
  userName: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    lowercase: true,
    minlength: [3, 'The username needs to be at least 3 characters long'],
    maxlength: [25, 'The username needs to be not more 25 characters long'],
    validate: {
      validator: /^[a-zA-Z0-9_-]*$/,
      message: 'The username can only contain letters, numbers, underscores and dashes',
    },
  },
  password: { type: String, required: true },
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
  channels: [{ type: Types.ObjectId, ref: 'Channel' }],
});

module.exports = model('User', userSchema);
