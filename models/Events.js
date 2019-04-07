const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  admin: {
    type: String,
    required: true
  },
  eventtitle: {
    type: String,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  Price: {
    type: Number,
    required: true
  },
  Description: {
    type: String,
    required: true
  }
});

module.exports = Events = mongoose.model("events", eventSchema);
