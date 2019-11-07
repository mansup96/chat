const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = mongoose.model("Message", {
  _id: Schema.Types.ObjectId,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  message: String,
  isSystem: Boolean,
  imageUrl: String,
  timestamp: Number
});

const UserSchema = mongoose.model("User", {
  _id: Schema.Types.ObjectId,
  name: String,
  image: String
});

module.exports = {
  MessageSchema,
  UserSchema
};
