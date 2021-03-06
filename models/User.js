const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcrypt');

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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'The password needs to be at least 5 characters long'],
    maxlength: [30, 'The password needs to be not more 30 characters long'],
  },
  confirmed: { type: Boolean, default: false },
  darkTheme: { type: Boolean, default: false },
  messages: [{ type: Types.ObjectId, ref: 'Message' }],
  channels: [{ type: Types.ObjectId, ref: 'Channel' }],
});

userSchema.post('validate', async (user) => {
  // eslint-disable-next-line no-param-reassign
  user.password = await bcrypt.hash(user.password, 12);
});

module.exports = model('User', userSchema);
