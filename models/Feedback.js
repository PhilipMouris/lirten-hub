const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = require("./User").schema;

const feedbackSchema = new Schema({
  member: {
    type: userSchema,
    required: true
  },
  datePosted: {
    type: Date,
    default: Date.now()
  },
  feedbackText: {
    type: String,
    required: true
  }
});

module.exports = Feedback = mongoose.model("feedbacks", feedbackSchema);
