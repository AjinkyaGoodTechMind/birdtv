const mongoose = require("mongoose");
const { Schema } = mongoose;

const videoSchema = new Schema({
  domain: { type: Schema.Types.ObjectId },
  title: { type: Schema.Types.String },
  userId: { type: Schema.Types.ObjectId },
  file: { type: Schema.Types.String },
  description: { type: Schema.Types.String },
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

const video = mongoose.model("video", videoSchema);

module.exports = video;
