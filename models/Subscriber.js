const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subscriberSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});
module.exports = Subscriber = mongoose.model("subscribers", subscriberSchema);
