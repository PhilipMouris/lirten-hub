const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recoveredSchema = new Schema({
  userId: {
    type: String
  },
  recovery: {
    type: String
  }
});
module.exports = Recovery = mongoose.model("Recovery", recoveredSchema);
