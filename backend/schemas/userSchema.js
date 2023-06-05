const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
  role: { type: Schema.Types.String, default: "user", enum: ["user", "admin"] },
  password: { type: Schema.Types.String },
  createdAt: { type: Schema.Types.Date, default: Date.now },
});

const user = mongoose.model("user", userSchema);

module.exports = user;
