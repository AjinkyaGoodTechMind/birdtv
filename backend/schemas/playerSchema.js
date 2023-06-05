const mongoose = require("mongoose");
const { Schema } = mongoose;

const playerSchema = new Schema({
  domain: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId },
  playerName: { type: Schema.Types.String },
  generalSettings: {
    playerSize: {
      height: { type: Schema.Types.Number },
      width: { type: Schema.Types.Number },
      position: {
        top: { type: Schema.Types.Number },
        left: { type: Schema.Types.Number },
      },
    },
    mobileSize: {
      height: { type: Schema.Types.Number },
      width: { type: Schema.Types.Number },
      position: {
        top: { type: Schema.Types.Number },
        left: { type: Schema.Types.Number },
      },
    },
    autoPlay: { type: Schema.Types.Boolean },
    pauseAdWhenOutOfView: { type: Schema.Types.Boolean },
    continuePlaylist: { type: Schema.Types.Boolean },
    loop: { type: Schema.Types.Boolean },
    muted: { type: Schema.Types.Boolean },
    pauseWhenOutOfView: { type: Schema.Types.Boolean },
  },
  sticky: {
    stick: { type: Schema.Types.Boolean },
    position: {
      top: { type: Schema.Types.Number },
      left: { type: Schema.Types.Number },
    },
    playerSize: {
      height: { type: Schema.Types.Number },
      width: { type: Schema.Types.Number },
    },
  },
  adUnit: {
    actAsAdUnit: { type: Schema.Types.Boolean },
    inSlide: { type: Schema.Types.Boolean },
    position: { type: Schema.Types.String },
  },
  ads: {
    ads: { type: Schema.Types.Boolean },
    preRoll: {
      preRoll: { type: Schema.Types.Boolean },
      vastTag: { type: Schema.Types.String },
    },
    postRoll: {
      postRoll: { type: Schema.Types.Boolean },
      vastTag: { type: Schema.Types.String },
    },
    midRoll: {
      midRoll: { type: Schema.Types.Boolean },
      adTime: [
        {
          offset: { type: Schema.Types.Number },
          tag: [{ type: Schema.Types.String }],
          type: { type: Schema.Types.String, default: "linear" },
        },
      ],
    },
  },
});

const player = mongoose.model("player", playerSchema);

module.exports = player;
