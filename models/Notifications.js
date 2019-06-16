const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const notificationSchema = new Schema({
  userId: {
    type: String
  },
  data: Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false
  },
  img: {
    type: String,
    default: "https://react.semantic-ui.com/images/wireframe/image.png"
  }
});
module.exports = Notifications = mongoose.model(
  "notifications",
  notificationSchema
);
