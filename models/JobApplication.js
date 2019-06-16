const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const vacancySchema = require("./Vacancy").schema;
const userSchema = require("./User").schema;
const jobApplicationSchema = new Schema({
  vacancy: {
    type: vacancySchema,
    required: true
  },
  member: {
    type: userSchema,
    required: true
  },
  datePosted: {
    type: Date,
    default: Date.now
  },
  applicationText: {
    type: String
  },
  state:{
    type:String,
    default:"pending"
  }
});
module.exports = JobApplication = mongoose.model(
  "jobApplications",
  jobApplicationSchema
);
