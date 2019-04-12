const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  admin: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  UserName: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  contactNumber: {
    type: Number,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  Course: {
    type: String,
    required: true
  },
  assignedTrainer: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  pendingAmount: {
    type: Number,
    default: null
  },
  totalAmount: {
    type: Number,
    required: true
  }
});

module.exports = User = mongoose.model("user", UserSchema);
