const mongoose = require("mongoose");
const { Schema } = mongoose;

const domainSchema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  domain: { type: Schema.Types.String },
  gaCode: { type: Schema.Types.String },
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

const domain = mongoose.model("domain", domainSchema);

module.exports = domain;
