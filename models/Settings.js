const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newSetiing = new Schema({
  admin: {
    type: String,
    required: true
  },
  name: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  Dob: {
    type: Date
  },
  Height: {
    type: Number
  },
  Weight: {
    type: String
  },
  email: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  phone: {
    type: Number
  }
});

module.exports = Setting = mongoose.model("setting", newSetiing);
