const mongoose = require("mongoose");
const { Schema } = mongoose;

const contentUnitSchema = new Schema({
  domain: { type: Schema.Types.ObjectId },
  title: { type: Schema.Types.String },
  userId: { type: Schema.Types.ObjectId },
  playlist: { type: Schema.Types.ObjectId, ref: "playlist" },
  player: { type: Schema.Types.ObjectId, ref: "player" },
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

const contentUnit = mongoose.model("contentUnit", contentUnitSchema);

module.exports = contentUnit;
