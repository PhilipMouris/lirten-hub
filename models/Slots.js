const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = require("./User").schema;

const SlotSchema = new Schema({
  booked: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String
  },
  member: {
    type: userSchema
  },
  confirmed: {
    type: Boolean,
    required: true
  }
});

module.exports = Slot = mongoose.model("slots", SlotSchema);
