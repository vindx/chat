const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  messages: [{ type: Types.ObjectId, ref: "Message" }],
  channels: [{ type: Types.ObjectId, ref: "Channel" }]
});

module.exports = model("User", userSchema);
