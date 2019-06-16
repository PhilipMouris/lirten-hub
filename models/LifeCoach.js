const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slotSchema = require("./Slots").schema;
const LifeCoachSchema = new Schema(
  {
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    hourlyRate: {
      type: String
    },
    age: {
      type: Number
    },
    monthlySlots: {
      type: [slotSchema]
    },
    ratings: {
      type: [Object],
      default: []
    }
  },
  { _id: false }
);
module.exports = LifeCoach = mongoose.model("lifeCoaches", LifeCoachSchema);
